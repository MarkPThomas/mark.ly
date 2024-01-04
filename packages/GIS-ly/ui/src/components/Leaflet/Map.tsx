import { useEffect, useState, useRef } from 'react';
import {
  LatLngBoundsExpression,
  LatLngTuple,
  Layer
} from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { FeatureCollection as FeatureCollectionSerial } from 'geojson';
import Control from "react-leaflet-custom-control";


import { Conversion } from '../../../../../common/utils/units/conversion/Conversion';
import { StateHistory } from '../../../../../common/utils/history/StateHistory';

import {
  toGeoJson,
  toGpxFile,
  toKmlFile
} from '../../model/Files';

import { Feature } from '../../model/GeoJSON';
import { GeoJsonManager } from '../../model/GIS';
import { ITrackCriteria } from '../../model/GIS/settings';
import { Track } from '../../model/GIS/Core/Track';
import {
  StationarySmoother,
  SpeedSmoother,
  NoiseCloudSmoother,
  AngularSpeedSmoother,
  ElevationSpeedSmoother
} from '../../model/GIS/Actions/Smooth';
import { DurationSplitter } from '../../model/GIS/Actions/Split';
import { CruftManager } from '../../model/GIS/Actions/Cruft/CruftManager';

import { Settings } from '../../Settings';

import { createTileLayers, appendTilesApiKey } from './Layers/TileLayers';
import { MiniMapControl } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';

import cachedData from '../../../../server/data/gpsRaw/2023-07-05 - Elevation Data API Response.json';
import { IEditedStats, Stats } from './Custom/Stats/Paths/Stats';
import { PolylineStatsComparison } from './Custom/Stats/Paths/PolylineStatsComparison';
import { TrackCriteria } from './Custom/Settings/TrackCriteria';
import { POSITION_CLASSES } from './LeafletControls/controlSettings';
import { ControlHeaderExpand } from './LeafletControls/Custom/ControlHeaderExpand';
import { ControlItem } from './LeafletControls/Custom/ControlItem';
import { ControlHeaderSwap } from './LeafletControls/Custom/ControlHeaderSwap';

export interface IInitialPosition {
  point: LatLngTuple,
  zoom: number
}

export type MapProps = {
  config: Settings,
  restHandlers?
};

export const Map = ({ config, restHandlers }: MapProps) => {
  const [position, setPosition] = useState<IInitialPosition>(config.initialPosition);
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);
  const [trackCriteria, setTrackCriteria] = useState<ITrackCriteria>(config.trackCriteriaNormalized);

  const [layers, setLayers] = useState<LayersControlProps | null>(null)

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<{ [key: string]: Track }>({});
  const [history, setHistory] = useState<StateHistory<Track>>(null);
  const [originalTrackStats, setOriginalTrackStats] = useState<IEditedStats>(null);
  const [trackStats, setTrackStats] = useState<IEditedStats>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasElevations, setHasElevations] = useState<boolean>(false);

  useEffect(() => {
    console.log('Initializing map with config: ', config);
    setLayers(createTileLayers(config.baseLayers));
    // TODO: Finish fixing. This only breaks the 'Topo Map' underlay
    // Temporary stub is to include the API key in the URL in the config file
    // appendLayerApiKey(config.baseLayers[0], restHandlers.handleLayerApiKeys)
    // .then((result) => {
    //   result.position = layers.position;

    //   if (layers.overlays) {
    //     result.overlays = layers.overlays;
    //   }
    //   console.log('UseEffect completed: ', result)
    //   setLayers(result);
    // })
    // .catch((error) => {
    //   console.log('BaseLayers set failed', error);
    // });
  }, []);

  // TODO: Work out how this update should work when underlying geoJson is automatically updated
  const updateFromTrack = (track: Track, updateStats: boolean = true) => {
    console.log('updateFromTrack');
    console.log('Track: ', track);

    console.log('currentTrack: ', currentTrack);
    console.log('Tracks: ', tracks);

    setLayers(updateLayersProps());

    // Current Track
    const newBounds = track.boundingBox().toCornerLatLng();
    console.log('newBounds: ', newBounds);
    setBounds(newBounds);

    // TODO: Automate this when adding undo/redo by using key of track key & track version.
    //  Removes updateStats & any coordinated updateCurrentTrackStats calls
    if (updateStats) {
      updateCurrentTrackStats(track);
    }
  }

  const updateCurrentTrackStats = (track: Track) => {
    console.log('updating stats on track: ', track)
    if (track) {
      const trackStats = track.getStats();
      setTrackStats(trackStats);
    }
  }

  const updateLayersProps = (): LayersControlProps => {
    const overlays = Object.values(tracks).map((track) => overlayDefinition(track));
    console.log('updateLayersProps->overlays: ', overlays)

    const layersProps = overlays.length ? {
      ...layers,
      overlays
    } : layers;
    console.log('layersProps: ', layersProps)

    return layersProps;
  }


  const overlayDefinition = (track: Track) => {
    const coords = track.trackPoints();
    console.log('newCoords: ', coords);

    const segments = track.trackSegments();

    const geoJson = track.toJson();
    console.log('newGeoJson: ', geoJson);

    const trackName = track.name;
    console.log('trackName: ', trackName);

    const onEachFeature = (feature: Feature, layer: Layer) => {
      if (feature.properties) {
        layer.bindTooltip(`Track: ${trackName}`, { sticky: true });
      }
      layer.on({
        mouseover: onMouseOver,
        click: onClick
      });
    };
    const onMouseOver = (e) => { console.log('mous-e!', e) }
    const onClick = (e) => {
      if (trackName !== currentTrack.name) {
        const selectedTrack = tracks[trackName];
        changeCurrentTrack(selectedTrack);
      } else {
        console.log('click-e!', e)
      }
    }
    // Note: e for both events contain the following properties of interest:
    // containerPoint: Point { x: 514, y:317 } - seems to stay relative to the displayed container, TL origin
    // layerPoint:  Point { x: 514, y:317 } - seems to increase with zoom scale, BR origin?
    // latlng: LatlLng {lat: -10.3333, lng:-77.8876785}

    // target
    // 	_bounds: [LatLng, LatLng]
    // 	feature (GeoJSON definition)
    // 	options
    // 		children[0].props {
    // 			points: TrackPoints[]
    // 			segments: TrackSegments[]
    // 		}: CoordinateMarkersLayer

    return {
      name: `Track: ${trackName}`,
      geoJSON: geoJson,
      points: coords,
      segments,
      onEachFeature
    }
  }

  const addTracks = (newTracks: Track[]) => {
    console.log(`Adding ${newTracks.length} tracks`);
    const tracksModify = tracks;

    newTracks.forEach((track) => {
      tracksModify[track.time] = track;
    })

    setTracks(tracksModify);
  }

  const removeTrack = (track: Track) => {
    console.log('Removing track: ', track);
    const tracksModify = tracks;

    if (currentTrack === track) {
      changeCurrentTrackToNext(track);
    }

    delete tracksModify[track.time];

    setTracks(tracksModify);
  }

  // Changes track to next one alphabetically by time keys
  const changeCurrentTrackToNext = (track: Track) => {
    console.log('changeCurrentTrackToNext');
    const trackTimes = Object.keys(tracks);

    if (trackTimes) {
      const sortedTimes = trackTimes.sort();
      const trackIndex = sortedTimes.indexOf(track.time);
      const nextTrack = tracks[trackIndex + 1] ?? null;

      changeCurrentTrack(nextTrack);
    }
  }

  const handleTrackSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTrackTime = e.target.value;
    const selectedTrack = tracks[selectedTrackTime];
    changeCurrentTrack(selectedTrack);
  }

  const changeCurrentTrack = (track: Track) => {
    console.log('Changing current track', track)
    // TODO: Placeholder for saving state for later under/redo operations here...

    setCurrentTrack(track);
    updateCurrentTrackStats(track);
  }

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    console.log('Read file: ', file);

    toGeoJson(file, [
      // Save converted geojson to hook state
      // SetLayer
      (geoJson: FeatureCollectionSerial) => {
        console.log('geoJson/Layer: ', geoJson)
        console.log('Tracks before set: ', tracks);

        // save converted geoJson to hook within Track
        // Generate track for CRUD that is reflected in geoJson via hooks
        const track = GeoJsonManager.TrackFromJson(geoJson);

        // TODO: Can withold this to when user selects to enter 'Trackly' mode for editing.
        track.addProperties();

        if (track) {
          setHistory(new StateHistory<Track>(track.time, track));

          changeCurrentTrack(track);
          addTracks([track]);
          console.log('currentTrack: ', currentTrack);
          console.log('Tracks after set: ', tracks);

          updateFromTrack(track, false);

          const trackStats = track.getStats();
          setOriginalTrackStats(trackStats);
        }
      }]);
  };

  const handleGPXSaveFile = () => {
    toGpxFile(currentTrack.toJson());
  }

  const handleKMLSaveFile = () => {
    toKmlFile(currentTrack.toJson());
  }

  const animateRef = useRef(true);
  const handleSetViewOnClick = () => {
    animateRef.current = !animateRef.current;
    console.log('Toggled animateRef!', animateRef.current);
  }

  const showPreview = useRef(true);
  const handleShowPreview = () => {
    showPreview.current = !showPreview.current;
    console.log('Toggled showPreview!', showPreview.current);
  }



  const handleTrimCruft = () => {
    console.log('handleTrimCruft')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new CruftManager(currentTrack);

        // const triggerDistanceM: number = 5000;
        const triggerDistanceM = trackCriteria.cruft.gapDistanceMax;
        console.log('triggerDistanceM: ', triggerDistanceM)
        const numberTrimmed = manager.trimTrackByCruft(triggerDistanceM);

        console.log(`number nodes removed: ${numberTrimmed}`);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleSplitOnStop = () => {
    console.log('handleSplitOnStop')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new DurationSplitter(currentTrack);

        // const triggerStopDurationS: number = 3 hrs = 10,800 sec;
        const maxStopDurationS = trackCriteria.split.stopDurationMax;
        console.log('maxStopDurationS: ', maxStopDurationS)
        // const minMoveDurationS: number = 5 min = 300 sec;
        const minMoveDurationS = trackCriteria.split.moveDurationMin;
        console.log('minMoveDurationS: ', minMoveDurationS)
        const splitResults = manager.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

        console.log(`number tracks returned: ${splitResults.tracks.length}`);
        console.log(`number segments split on: ${splitResults.segments.length}`);
        console.log(`number points split by: ${splitResults.points.length}`);

        if (splitResults.tracks.length > 1) {
          removeTrack(currentTrack);
          addTracks(splitResults.tracks);

          const newCurrentTrack = splitResults.tracks[0];
          changeCurrentTrack(newCurrentTrack);
          updateFromTrack(newCurrentTrack, false);
        }
      });
    }
  }

  const handleSmoothStationary = () => {
    console.log('handleSmoothStationary')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new StationarySmoother(currentTrack);

        // 0.11176 meters/sec = 0.25 mph is essentially stationary
        // const minSpeedMS = 0.11176;
        const minSpeedMS = trackCriteria.activities.hiking.speed.min;
        console.log('minSpeedMS: ', minSpeedMS)

        let numberNodesRemoved = manager.smoothStationary(minSpeedMS, true);
        console.log('numberNodesRemoved: ', numberNodesRemoved);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleSmoothBySpeed = () => {
    console.log('handleSmoothBySpeed')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new SpeedSmoother(currentTrack);

        // 1.78816 meters/sec = 4 mph
        const speedLimitKph = Conversion.Speed.mphToKph(4);
        const speedLimitMpS = Conversion.Speed.kphToMetersPerSecond(speedLimitKph);
        console.log('old speedLimitMS: ', speedLimitMpS)


        const speedLimitMS = trackCriteria.activities.hiking.speed.max;
        console.log('speedLimitMS: ', speedLimitMS)

        let numberNodesRemoved = manager.smoothBySpeed(speedLimitMS, true);
        console.log('numberNodesRemoved: ', numberNodesRemoved);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleSmoothByAngularSpeed = () => {
    console.log('handleSmoothByAngularSpeed')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new AngularSpeedSmoother(currentTrack);

        //1.0472; // 60 deg/sec = 3 seconds to walk around a switchback
        // const angularSpeedLimitRadS = 1.0472;
        const angularSpeedLimitRadS = trackCriteria.activities.hiking.rotation.angularVelocityMax;
        console.log('angularSpeedLimitRadS: ', angularSpeedLimitRadS)

        let numberNodesRemoved = manager.smoothByAngularSpeed(angularSpeedLimitRadS, true);
        console.log('numberNodesRemoved: ', numberNodesRemoved);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleSmoothNoiseCloud = () => {
    console.log('handleSmoothNoiseCloud')
    if (currentTrack) {
      handleCmd(() => {
        const gpsTimeIntervalS = trackCriteria.misc.gpsTimeInterval;
        console.log('gpsTimeIntervalS: ', gpsTimeIntervalS)
        const manager = new NoiseCloudSmoother(currentTrack, gpsTimeIntervalS);

        // 0.11176 meters/sec = 0.25 mph is essentially stationary
        // const minSpeedMS = 0.11176;
        const minSpeedMS = trackCriteria.noiseCloud.speedMin;
        console.log('minSpeedMS: ', minSpeedMS)

        let numberNodesRemoved = manager.smoothNoiseClouds(minSpeedMS, true);
        console.log('numberNodesRemoved: ', numberNodesRemoved);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleGetApiElevation = () => {
    console.log('handleGetElevation')
    if (currentTrack) {
      handleCmd(() => {
        currentTrack.addElevationsFromApi();

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleGetCachedElevation = () => {
    if (currentTrack) {
      handleCmd(() => {
        const cachedDataMap = {};

        cachedData.forEach((apiCall) => {
          apiCall.results.forEach((response) => {
            cachedDataMap[`${response.location.lat},${response.location.lng}`] = response.elevation;
          });
        });

        currentTrack.addElevations(cachedDataMap);

        updateFromTrack(currentTrack);
        setHasElevations(true);
      });
    }
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    if (currentTrack) {
      handleCmd(() => {
        const manager = new ElevationSpeedSmoother(currentTrack);

        //0.254 meters/second = 3000 ft / hr
        // const ascentSpeedLimitMPS = 0.254;
        // const descentSpeedLimitMPS = 1.5 * ascentSpeedLimitMPS;
        const ascentSpeedLimitMS = trackCriteria.activities.hiking.elevation.ascentRateMax;
        console.log('ascentSpeedLimitMS: ', ascentSpeedLimitMS)
        const descentSpeedLimitMS = trackCriteria.activities.hiking.elevation.descentRateMax;
        console.log('descentSpeedLimitMS: ', descentSpeedLimitMS)

        let numberNodesRemoved = manager.smoothByElevationSpeed(ascentSpeedLimitMS, descentSpeedLimitMS, true);
        console.log('numberNodesRemoved: ', numberNodesRemoved);

        updateFromTrack(currentTrack);
      });
    }
  }

  const handleCmd = (command: () => void) => {
    if (command) {
      history.executeCmd(getKey(), currentTrack.clone(), command);

      console.log('handleCmd: ', history)
      setHistory(history);
    }
  }

  const handleUndo = () => {
    const key = getKey();
    history.undo(key, currentTrack);
    console.log('Undo: ', history)

    console.log('# vertices: ', currentTrack.trackPoints().length)
    const currentTrackState = history.getState(key);
    console.log('currentTrackState: ', currentTrackState);
    console.log('# vertices: ', currentTrackState.trackPoints().length)

    setHistory(history);
    updateFromTrack(currentTrackState);
  }

  const handleRedo = () => {
    const key = getKey();
    history.redo(key);
    console.log('Redo: ', history)

    setHistory(history);
    updateFromTrack(history.getState(key));
  }

  const getKey = (): string => {
    return currentTrack?.time;
  }

  const hasUndo = history?.hasUndo(getKey());
  console.log('hasUndo: ', hasUndo);

  const hasRedo = history?.hasRedo(getKey());
  console.log('hasRedo: ', hasRedo);


  console.log('layersProps:', layers)
  console.log('position.zoom: ', position.zoom)
  console.log('bounds:', bounds)

  const tracksValues = Object.values(tracks);

  return (
    layers ?
      <div id="map-container">
        <MapContainer
          center={position.point}
          zoom={position.zoom}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '700px' }}
        >
          {layers.baseLayers[0].item}
          <MiniMapControl
            position={POSITION_CLASSES.bottomright}
            zoom={Math.floor(position.zoom / 2)}
            tileSourceUrl={config.miniMap.url}
          />
          {
            (layers.baseLayers?.length > 1 || layers.overlays?.length)
              ?
              <LayersControl {...layers} />
              : null
          }
          <Control position="topleft">
            <ControlHeaderExpand
              category="file"
              children={[
                <ControlItem
                  key={'file open'}
                  type="file"
                  criteria="open..."
                  cb={handleTrimCruft}
                />,
                <ControlHeaderExpand
                  key={'file save'}
                  category="save selected..."
                  childrenBeside={true}
                  children={[
                    <ControlItem
                      key={'save gpx'}
                      type="save"
                      criteria="gpx"
                      cb={handleGPXSaveFile}
                    />,
                    <ControlItem
                      key={'save kml'}
                      type="save"
                      criteria="kml"
                      cb={handleKMLSaveFile}
                    />
                  ]}
                />,
              ]}
            />
          </Control>
          <Control position="topleft">
            <ControlHeaderSwap
              category="options"
              children={[
                <div key="animatePan">
                  <input type="checkbox" onClick={handleSetViewOnClick} id="animatePan" defaultChecked />
                  <label htmlFor="animatePan">Set View On Click</label>
                </div>,
                <div key="showPreview">
                  <input type="checkbox" onClick={handleShowPreview} id="showPreview" defaultChecked />
                  <label htmlFor="showPreview">Show Clean Previews</label>
                </div>
              ]}
            />
          </Control>
          <Control position="topleft">
            <ControlHeaderExpand
              category="clean"
              children={[
                <ControlHeaderExpand
                  key={'trim'}
                  category="trim"
                  childrenBeside={true}
                  children={[
                    <ControlItem
                      key={'trim cruft'}
                      type="trim"
                      criteria="cruft"
                      cb={handleTrimCruft}
                    />
                  ]}
                />,
                <ControlHeaderExpand
                  key={'smooth'}
                  category="smooth"
                  childrenBeside={true}
                  children={[
                    <ControlItem
                      key={'smooth stopped'}
                      type="smooth"
                      criteria="stopped"
                      cb={handleSmoothStationary}
                    />,
                    <ControlItem
                      key={'smooth noise cloud'}
                      type="smooth"
                      criteria="noise cloud"
                      cb={handleSmoothNoiseCloud}
                    />,
                    <ControlItem
                      key={'smooth speed'}
                      type="smooth"
                      criteria="speed"
                      cb={handleSmoothBySpeed}
                    />,
                    <ControlItem
                      key={'smooth angular speed'}
                      type="smooth"
                      criteria="angular speed"
                      cb={handleSmoothByAngularSpeed}
                    />,
                    <ControlItem
                      key={'smooth elevation rate'}
                      type="smooth"
                      criteria="elevation rate"
                      isDisabled={!hasElevations}
                      cb={handleSmoothByElevation}
                    />
                  ]}
                />,
                <ControlHeaderExpand
                  key={'split'}
                  category="split"
                  childrenBeside={true}
                  children={[
                    <ControlItem
                      key={'split finish'}
                      type="split"
                      criteria="finish"
                      cb={handleSplitOnStop}
                    />
                  ]}
                />
              ]}
            />
          </Control>
          <Control position="topleft">
            <ControlHeaderExpand
              key={'edit'}
              category="edit"
              childrenBeside={true}
              children={[]}
              isDisabled={true}
              cb={() => setIsEditing(!isEditing)}
            />
          </Control>
          <Control position="bottomleft">
            <ControlItem
              key={'history undo'}
              type="history"
              criteria="undo"
              isDisabled={!hasUndo}
              cb={handleUndo}
            />
            <ControlItem
              key={'history redo'}
              type="history"
              criteria="redo"
              isDisabled={!hasRedo}
              cb={handleRedo}
            />
          </Control>
          {/* <PolylineComparisonControl /> */}
          {bounds ? <SetViewOnTrackLoad bounds={bounds} /> : null}
          <SetViewOnClick animateRef={animateRef} />
        </MapContainer>
        {
          currentTrack ?
            <div>
              <h2>Selected Track: {currentTrack.name}</h2>
              {tracksValues.length > 1 ?
                <div>
                  <label htmlFor="tracks-selection">Selected Track: </label>
                  <select name="tracks" id="tracks-selection" value={currentTrack.time} onChange={handleTrackSelection}>
                    {
                      tracksValues.map((track) =>
                        <option value={track.time} key={track.time}>{track.name}</option>
                      )
                    }
                  </select>
                </div>
                : null}
            </div>
            : null
        }

        <input type="file" onChange={handleFileSelection} />

        {isEditing ? <div className="editing-label">Editing</div> : null}

        <br />
        <hr />

        <input type="button" disabled onClick={handleGetApiElevation} value="Get Elevation Data from API" />

        {
          !currentTrack
            ? <input type="button" disabled value="Get Cached Elevation Data" />
            : <input type="button" onClick={handleGetCachedElevation} value="Get Cached Elevation Data" />
        }

        <br />
        <hr />

        <div className="stats-container">
          {originalTrackStats ?
            <PolylineStatsComparison statsInitial={originalTrackStats} statsCurrent={trackStats} /> : null
          }
          {trackStats !== null ?
            <Stats stats={trackStats} /> : null
          }
          {config.trackCriteria ?
            <TrackCriteria criteria={config.trackCriteria} /> : null
          }
          {config.trackCriteriaNormalized ?
            <TrackCriteria criteria={config.trackCriteriaNormalized} /> : null
          }
        </div>
      </div > : null
  )
}
