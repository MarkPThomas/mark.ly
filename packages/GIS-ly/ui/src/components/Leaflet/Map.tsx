import { useEffect, useState, useRef } from 'react';
import {
  LatLngBoundsExpression,
  LatLngTuple
} from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { FeatureCollection as FeatureCollectionSerial } from 'geojson';

import { Conversion } from '../../../../../common/utils/units/conversion/Conversion';

import {
  toGeoJson,
  toGpxFile,
  toKmlFile
} from '../../model/Files';

import {
  GeoJsonManager
} from '../../model/GIS';

import {
  Track,
  TrackPoint
} from '../../model/GIS/Core/Track';

import {
  StationarySmoother,
  SpeedSmoother,
  NoiseCloudSmoother,
  AngularSpeedSmoother,
  ElevationSpeedSmoother
} from '../../model/GIS/Actions/Smooth';
import { DurationSplitter } from '../../model/GIS/Actions/Split';
import { CruftManager } from '../../model/GIS/Actions/Cruft/CruftManager';
import { ITrackCriteria } from '../../model/GIS/settings';

import { Settings } from '../../Settings';

import { createTileLayers, appendTilesApiKey } from './Layers/TileLayers';
import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';

import cachedData from '../../../../server/data/gpsRaw/2023-07-05 - Elevation Data API Response.json';
import { IEditedTrackStats, TrackStats } from './Custom/Stats/Paths/TrackStats';
import { TrackStatsComparison } from './Custom/Stats/Paths/TrackStatsComparison';

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
  const [trackCriteria, setTrackCriteria] = useState<ITrackCriteria>(config.trackCriteria);

  const [layers, setLayers] = useState<LayersControlProps | null>(null)

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<{ [key: string]: Track }>({});
  const [originalTrackStats, setOriginalTrackStats] = useState<IEditedTrackStats>(null);
  const [trackStats, setTrackStats] = useState<IEditedTrackStats>(null);

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

    return {
      name: `Track: ${trackName}`,
      geoJSON: geoJson,
      points: coords,
      segments
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

  const changeCurrentTrack = (track: Track) => {
    console.log('Changing current track', track)
    // TODO: Placeholder for saving state for later under/redo operations here...

    setCurrentTrack(track);
    updateCurrentTrackStats(track);
  }

  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
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
    console.log('Toggled!');
    animateRef.current = !animateRef.current;
  }

  // TODO: Determine if imported tracks are always merged immediately,
  //  Or if this first step is to be left. Could be displayed as
  //  2-3 layer items, one set being the original imported track
  //  and another colored differently to show where the multilines occur.
  //   e.g. different colored trackpoints, or different colored lines

  // const handleMergeTrackSegments = () => {
  //   console.log('handleMergeTrackSegments')
  //   if (layer as GeoJSONFeatureCollection) {
  //     const geoJson = mergeTackSegments(layer as GeoJSONFeatureCollection);
  //     const newCoords = getCoords(geoJson);
  //     updateFromGeoJson(geoJson, newCoords as TrackPoint[]);
  //   }
  // }

  // TODO: Implement Split ticket
  // const handleSplitCruft = () => {
  //   console.log('handleSplitCruft')
  //   if (layer as GeoJSONFeatureCollection && track) {
  //     const manager = new CruftManager(track);

  //     const triggerDistanceKM: number = 5;
  //     const tracks = manager.splitTrackSegmentByCruft(triggerDistanceKM);

  //     console.log('geoJson: ', geoJsonLayers)
  //     // TODO: Add ability for multiple GeoJson layers, programmatic styling
  //   }
  // }

  const handleTrimCruft = () => {
    console.log('handleTrimCruft')
    if (currentTrack) {
      const manager = new CruftManager(currentTrack);

      // const triggerDistanceM: number = 5000;
      const triggerDistanceM = trackCriteria.cruft.gapDistanceMax;
      console.log('triggerDistanceM: ', triggerDistanceM)
      const numberTrimmed = manager.trimTrackByCruft(triggerDistanceM);

      console.log(`number nodes removed: ${numberTrimmed}`);

      updateFromTrack(currentTrack);
    }
  }

  const handleSplitOnStop = () => {
    console.log('handleSplitOnStop')
    if (currentTrack) {
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
    }
  }

  const handleSmoothStationary = () => {
    console.log('handleSmoothStationary')
    if (currentTrack) {
      const manager = new StationarySmoother(currentTrack);

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      // const minSpeedMS = 0.11176;
      const minSpeedMS = trackCriteria.activities.hiking.speed.min;
      console.log('minSpeedMS: ', minSpeedMS)

      let numberNodesRemoved = manager.smoothStationary(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(currentTrack);
    }
  }

  const handleSmoothBySpeed = () => {
    console.log('handleSmoothBySpeed')
    if (currentTrack) {
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
    }
  }

  const handleSmoothByAngularSpeed = () => {
    console.log('handleSmoothByAngularSpeed')
    if (currentTrack) {
      const manager = new AngularSpeedSmoother(currentTrack);

      //1.0472; // 60 deg/sec = 3 seconds to walk around a switchback
      // const angularSpeedLimitRadS = 1.0472;
      const angularSpeedLimitRadS = trackCriteria.activities.hiking.rotation.angularVelocityMax;
      console.log('angularSpeedLimitRadS: ', angularSpeedLimitRadS)

      let numberNodesRemoved = manager.smoothByAngularSpeed(angularSpeedLimitRadS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(currentTrack);
    }
  }

  const handleSmoothNoiseCloud = () => {
    console.log('handleSmoothNoiseCloud')
    if (currentTrack) {
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
    }
  }

  const handleGetApiElevation = () => {
    console.log('handleGetElevation')
    if (currentTrack) {
      currentTrack.addElevationsFromApi();

      updateFromTrack(currentTrack);
    }
  }

  const handleGetCachedElevation = () => {
    const cachedDataMap = {};

    cachedData.forEach((apiCall) => {
      apiCall.results.forEach((response) => {
        cachedDataMap[`${response.location.lat},${response.location.lng}`] = response.elevation;
      });
    });

    currentTrack.addElevations(cachedDataMap);

    updateFromTrack(currentTrack);
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    if (currentTrack) {
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
    }
  }

  console.log('layersProps:', layers)
  console.log('position.zoom: ', position.zoom)
  console.log('bounds:', bounds)

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
          <MiniMapControl position={POSITION_CLASSES.bottomright} zoom={Math.floor(position.zoom / 2)} tileSourceUrl={config.miniMap.url} />
          {
            (layers.baseLayers?.length > 1 || layers.overlays?.length)
              ?
              <LayersControl {...layers} />
              : null
          }
          {bounds ? <SetViewOnTrackLoad bounds={bounds} /> : null}
          <SetViewOnClick animateRef={animateRef} />
        </MapContainer>
        <div className="stats-container">
          {originalTrackStats ?
            <TrackStatsComparison statsInitial={originalTrackStats} statsCurrent={trackStats} /> : null
          }
          {trackStats !== null ?
            <TrackStats stats={trackStats} /> : null
          }
        </div>
        <input type="file" onChange={handleFileSelection} />
        <input type="checkbox" onClick={handleSetViewOnClick} id="animatePan" value="animatePan" defaultChecked />
        <label htmlFor="animatePan">Set View On Click</label>
        {/* <input type="button" onClick={handleMergeTrackSegments} value="Merge Track Segments" /> */}

        <br />
        <hr />

        <input type="button" onClick={handleTrimCruft} value="Trim Cruft" />

        {/* <input type="button" onClick={handleSplitCruft} value="Split Cruft" /> */}
        <input type="button" onClick={handleSplitOnStop} value="Split Separate Movements" />

        <br />
        <hr />

        <input type="button" onClick={handleSmoothStationary} value="Smooth Stationary" />
        <input type="button" onClick={handleSmoothNoiseCloud} value="Smooth Noise Cloud" />

        <input type="button" onClick={handleSmoothBySpeed} value="Smooth by Speed" />
        <input type="button" onClick={handleSmoothByAngularSpeed} value="Smooth by Angular Speed" />

        <br />
        <hr />

        {/* <input type="button" onClick={handleGetApiElevation} value="Get Elevation Data from API" /> */}
        <input type="button" onClick={handleGetCachedElevation} value="Get Cached Elevation Data" />
        <input type="button" onClick={handleSmoothByElevation} value="Smooth by Elevation Rate" />

        <br />
        <hr />

        <input type="button" onClick={handleGPXSaveFile} value="Save as GPX File" />
        <input type="button" onClick={handleKMLSaveFile} value="Save as KML File" />
      </div> : null
  )
}
