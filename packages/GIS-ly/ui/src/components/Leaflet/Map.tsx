import { useEffect, useState, useRef, SetStateAction } from 'react';
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
import { TrackCriteria } from './Custom/Settings/TrackCriteria';
import { POSITION_CLASSES } from './LeafletControls/controlSettings';
import { ControlHeaderExpand } from './LeafletControls/Custom/ControlHeaderExpand';
import { ControlItem } from './LeafletControls/Custom/ControlItem';
import { ControlHeaderSwap } from './LeafletControls/Custom/ControlHeaderSwap';
import { PolylineComparisonControl } from './LeafletControls/Custom/PolylineComparisonControl';
import { TrackStatsControl } from './LeafletControls/Custom/TrackStatsControl';
import { Modal } from '../shared/components/Modal';
import Dialog from '../shared/components/Dialog';
import { FileIcon } from '../shared/components/Icons/FileIcon';
import { OptionsIcon } from '../shared/components/Icons/OptionsIcon';
import { UndoRedoIcon } from '../shared/components/Icons/UndoRedoIcon';
import { EditIcon } from '../shared/components/Icons/EditIcon';
import { CleanIcon } from '../shared/components/Icons/CleanIcon';
import { SaveIcon } from '../shared/components/Icons/SaveIcon';
import { GraphIcon } from '../shared/components/Icons/GraphIcon';
import { StatsIcon } from '../shared/components/Icons/StatsIcon';
import { EditingControl } from './LeafletControls/Custom/EditingControl';

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

  const [showComparisonStats, setShowComparisonStats] = useState<boolean>(true);
  const [showTrackStats, setShowTrackStats] = useState<boolean>(true);
  const [animateRef, setAnimateRef] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasElevations, setHasElevations] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [currentFile, setCurrentFile] = useState<File>(null);
  const [showFileReplaceModal, setShowFileReplaceModal] = useState<boolean>(false);
  const [showElevationApiModal, setShowElevationApiModal] = useState<boolean>(false);
  const [showTrackCriteriaModal, setShowTrackCriteriaModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showNonModal, setShowNonModal] = useState<boolean>(false);

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

  const handleSetViewOnClick = () => {
    setAnimateRef(!animateRef);
    console.log('Toggled animateRef!', animateRef);

  }

  const handleShowPreview = () => {
    setShowPreview(!showPreview);
    console.log('Toggled showPreview!', showPreview);
  }

  const handleShowTrackCriteria = () => {
    setShowTrackCriteriaModal(!showTrackCriteriaModal);
  }

  const handleShowComparisonStats = () => {
    setShowComparisonStats(!showComparisonStats);
    console.log('Toggled showComparisonStats!', showComparisonStats);
  }

  const handleShowTrackStats = () => {
    setShowTrackStats(!showTrackStats);
    console.log('Toggled showTrackStats!', showTrackStats);
  }

  const handleOnEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleGraphClick = () => {
    setShowGraph(!showGraph);
  }

  // TODO: Work out how this update should work when underlying geoJson is automatically updated
  const updateFromTrack = (track: Track, updateStats: boolean = true) => {
    console.log('updateFromTrack');
    console.log('Track: ', track);

    console.log('currentTrack: ', currentTrack);
    console.log('Tracks: ', tracks);

    setLayers(updateLayersProps(track));

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

  const updateLayersProps = (selectedTrack?: Track): LayersControlProps => {
    const overlays = Object.values(tracks).map((track) => overlayDefinition(track));
    console.log('updateLayersProps->overlays: ', overlays)

    const layersProps = overlays.length ? {
      ...layers,
      overlays,
      selectedTrack: selectedTrack ?? currentTrack
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
        // mouseover: onMouseOver,
        click: onClick
      });
    };
    // const onMouseOver = (e) => { console.log('mous-e!', e) }
    const onClick = (_e: any) => {
      if (trackName !== currentTrack.name) {
        const selectedTrack = tracks[trackName];
        changeCurrentTrack(selectedTrack);
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
    setLayers(updateLayersProps(track));
  }

  // TODO: Handle case where user selects a file that was selected before - redo the file prompts rather than ignore
  //   Currently if the filename does not change, no action happens.
  //   However, this is different than cancelling out of the selection form. This behavior should be preserved.
  // const handleCancel = (e: React.ChangeEvent<HTMLInputElement>) => {

  // }

  // const acceptCurrentFile = (useSelected: boolean) => {
  //   if (useSelected) {
  //     setCurrentFile(selectedFile);
  //   } else {
  //     setSelectedFile(null);
  //   }
  // }

  // TODO: Currently this throws an error when removing children. Fix.
  const swapTracks = async () => {
    setCurrentTrack(null);
    setTracks({});
    await loadTrack();
  }

  const loadTrack = async () => {
    await loadFile(selectedFile);
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files[0];
  //   setSelectedFile(file);
  // };

  const handleFileReplaceDialog = (show: boolean) => {
    setShowModal(show);
    setShowFileReplaceModal(show);
  }

  const handleElevationApiDialog = (show: boolean) => {
    setShowModal(show);
    setShowElevationApiModal(show);
  }

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    console.log('Read file: ', file);

    if (currentTrack) {
      setSelectedFile(file);
      handleFileReplaceDialog(true);
    } else {
      // setCurrentFile(file)
      await loadFile(file);
    }
  };

  const loadFile = async (file: File) => {
    if (!file) {
      console.log('No file specified!');
      return;
    }

    console.log('loading file!');
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
          setHistory(new StateHistory<Track>()); // TODO: Consider adding GUID for Tracks as keys

          changeCurrentTrack(track);
          addTracks([track]);
          console.log('currentTrack: ', currentTrack);
          console.log('Tracks after set: ', tracks);

          updateFromTrack(track, false);

          const trackStats = track.getStats();
          setOriginalTrackStats(trackStats);
        }
      }]);
  }


  const handleGPXSaveFile = () => {
    toGpxFile(currentTrack.toJson());
  }

  const handleKMLSaveFile = () => {
    toKmlFile(currentTrack.toJson());
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

  const handleGetCachedElevation = async () => {
    if (currentTrack) {
      // handleCmd(() => {
      const cachedDataMap = {};

      cachedData.forEach((apiCall) => {
        apiCall.results.forEach((response) => {
          cachedDataMap[`${response.location.lat},${response.location.lng}`] = response.elevation;
        });
      });

      currentTrack.addElevations(cachedDataMap);

      updateFromTrack(currentTrack);
      setHasElevations(true);
      // });
    }
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    if (currentTrack) {
      if (!hasElevations) {
        setShowElevationApiModal(true);
      } else {
        handleSmoothByElevationWithElevations();
      }
    }
  }

  const handleSmoothByElevationWithElevations = () => {
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

  const handleCmd = (command: () => void) => {
    if (command) {
      history.executeCmd(getKey(), currentTrack.clone(), command);

      console.log('handleCmd: ', history)
      setHistory(history);
    }
  }

  // Was partway through instantiating class with initial state
  // This seems to not work, as handleCmd can only save state before the command is executed
  // Undo can save state before moving backward
  // However, this must only be done once, at the furthest action state
  //    Histories recorded as prior state + next action
  //    Then current state when first undo
  //    Object could record history length & state length, where current state is saved if state length not = history length +1
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

  // TODO: time is not the best key, as this can change as the track is modified. Add GUID.
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
      <>
        <div id="map-container">
          {currentTrack ?
            <div className="top-center control">
              <div className="selected-track">
                {tracksValues.length > 1 ?
                  <div className="selected-track-select">
                    <label htmlFor="tracks-selection"><h2>Selected Track:</h2></label>
                    <select name="tracks" id="tracks-selection" value={currentTrack.time} onChange={handleTrackSelection}>
                      {
                        tracksValues.map((track) =>
                          <option value={track.time} key={track.time}>{track.name}</option>
                        )
                      }
                    </select>
                  </div>
                  :
                  <h2>Selected Track: {currentTrack.name}</h2>
                }
              </div>
              {(showComparisonStats && originalTrackStats) ?
                <PolylineComparisonControl statsInitial={originalTrackStats} statsCurrent={trackStats} />
                : null}
            </div>
            : null}
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
            <Control position="topleft" prepend>
              {/* Below are kept for now for development convenience */}
              {/* {showModal ?
                <Modal
                  setShow={setShowModal}
                  buttons={[
                    {
                      label: 'Yes',
                      callback: () => {
                        console.log('I said Yes!!!')
                        setShowModal(true);
                      }
                    }, {
                      label: 'No',
                      callback: () => {
                        console.log('I said NOOOOOOOOO!!!')
                        setShowModal(false);
                      }
                    }
                  ]}
                  title={'Dialog'}
                >
                  <p>Warning!</p>
                  <p>Loading a new Track will replace the existing Tracks.</p>
                  <p>Do you want to continue loading the new Track?</p>
                  <p>Scroll<br />
                    ...<br />
                    ...<br />
                    ...<br />
                    ...<br />
                    Boo!
                  </p>
                </Modal>
                : null}
              {showNonModal ?
                <Dialog
                  setShow={setShowNonModal}
                  buttons={[
                    {
                      label: 'Yes',
                      callback: () => {
                        console.log('I said Yes!!!')
                        setShowNonModal(true);
                      }
                    }, {
                      label: 'No',
                      callback: () => {
                        console.log('I said NOOOOOOOOO!!!')
                        setShowNonModal(false);
                      }
                    }
                  ]}
                  title={'Dialog'}
                >
                  <p>Warning!</p>
                  <p>Loading a new Track will replace the existing Tracks.</p>
                  <p>Do you want to continue loading the new Track?</p>
                  <p>Scroll<br />
                    ...<br />
                    ...<br />
                    ...<br />
                    ...<br />
                    Boo!
                  </p>
                </Dialog>
                : null} */}
            </Control>
            {/* <Control position="topleft">
              <ControlItem type={'NonModal'} criteria={'NonModal'} cb={() => setShowNonModal(true)} />
            </Control>
            <Control position="topleft">
              <ControlItem type={'Modal'} criteria={'Modal'} cb={() => setShowModal(true)} />
            </Control> */}
            <Control position="topleft">
              <ControlHeaderExpand
                isDisabled={isEditing}
                category="file"
                iconSvg={
                  <FileIcon isDisabled={isEditing} />
                }
                children={[
                  <div key={'file open'} className="leaflet-bar item">
                    <input type="file" onChange={handleFileSelection} />
                  </div>,
                  <ControlHeaderExpand
                    key={'file save'}
                    category="save selected..."
                    childrenBeside={true}
                    isDisabled={!currentTrack}
                    iconSvg={<SaveIcon isDisabled={!currentTrack} />}
                    showLabelWithIcon={true}
                    children={[
                      <ControlItem
                        key={'save gpx'}
                        type="save"
                        criteria="gpx"
                        title="Save selected Track to GPX file"
                        cb={handleGPXSaveFile}
                      />,
                      <ControlItem
                        key={'save kml'}
                        type="save"
                        criteria="kml"
                        title="Save selected Track to KML file"
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
                iconSvg={
                  <OptionsIcon height="24px" />
                }
                children={[
                  <div key="options-config" className="options options-config">
                    <h3>Config</h3>
                    <a className="track-criteria-option"
                      href="#"
                      title="track-criteria-option"
                      aria-label="track-criteria-option"
                      aria-disabled="false"
                      role="button"
                      onClick={handleShowTrackCriteria}
                    >
                      <span aria-hidden="true">Track Criteria</span>
                    </a>
                  </div>,
                  <div key="options-display" className="options options-display">
                    <hr />
                    <h3>Display</h3>
                    <div key="showComparisonStats">
                      <input type="checkbox" onChange={handleShowComparisonStats} id="showComparisonStats" checked={showComparisonStats} />
                      <label htmlFor="showComparisonStats">Show Comparison Stats</label>
                    </div>
                  </div>,
                  <div key="options-misc" className="options options-misc">
                    <hr />
                    <h3>Misc</h3>
                    <div key="animatePan">
                      <input type="checkbox" onChange={handleSetViewOnClick} id="animatePan" checked={animateRef} />
                      <label htmlFor="animatePan">Set View On Click</label>
                    </div>
                    <div key="showPreview">
                      <input type="checkbox" onChange={handleShowPreview} id="showPreview" checked={showPreview} />
                      <label htmlFor="showPreview">Show Clean Previews</label>
                    </div>
                  </div>,
                ]}
              />
            </Control>
            {/* <Control position="bottomleft">

              {showTrackCriteriaModal ?
                <Modal
                  setShow={handleShowTrackCriteria}
                  buttons={[]}
                  title={'Track Criteria'}
                >
                  <div className="stats-container">
                    {config.trackCriteria ?
                      <TrackCriteria
                        criteria={config.trackCriteria}
                        title={"Specified"}
                        level={3}
                      /> : null
                    }
                    {config.trackCriteriaNormalized ?
                      <TrackCriteria
                        criteria={config.trackCriteriaNormalized}
                        title={"Normalized"}
                        level={3}
                      /> : null
                    }
                  </div>
                </Modal>
                : null}
              {showFileReplaceModal ?
                <Modal
                  setShow={handleFileReplaceDialog}
                  buttons={[
                    {
                      label: 'Replace',
                      callback: () => {
                        console.log('Replace')
                        // TODO: Handle case of re-selecting existing file after cancelling in this modal.
                        // acceptCurrentFile(true);
                        swapTracks();
                        handleFileReplaceDialog(false);
                      }
                    }, {
                      label: 'Merge',
                      callback: () => {
                        console.log('Merge')
                        // TODO: Handle case of re-selecting existing file after cancelling in this modal.
                        // TODO: Handle case of not reloading a prior loaded file. Maybe have a list of loaded names?
                        // acceptCurrentFile(true);
                        loadTrack();
                        handleFileReplaceDialog(false);
                      }
                    }, {
                      label: 'Cancel',
                      callback: () => {
                        console.log('Cancel')
                        // TODO: Handle case of re-selecting existing file after cancelling here.
                        // acceptCurrentFile(false);
                        handleFileReplaceDialog(false);
                      }
                    }
                  ]}
                  title={'Warning!'}
                >
                  <p>Tracks already exist.</p>
                  <p>Please select from the following actions:</p>
                </Modal>
                : null}

              {showElevationApiModal ?
                <Modal
                  setShow={handleElevationApiDialog}
                  buttons={[{
                    label: 'Fetch from API',
                    callback: async () => {
                      await handleGetCachedElevation();
                      // await handleGetApiElevation(); // TODO: Activate this & remove cached elevations method once API fixed
                      handleSmoothByElevationWithElevations();
                      handleElevationApiDialog(false);
                    }
                  }, {
                    label: 'Use existing',
                    callback: async () => {
                      handleSmoothByElevationWithElevations();
                      handleElevationApiDialog(false);
                    }
                  }, {
                    label: 'Cancel',
                    callback: () => {
                      handleElevationApiDialog(false);
                    }
                  }
                  ]}
                  title={'Elevations'}
                >
                  <p>Some Track Points are missing terrain elevations. <br />
                    Stats may be off if using incomplete or GPS-recorded altitudes.</p>
                </Modal>
                : null}
            </Control> */}
            {currentTrack ?
              <>
                <Control position="topleft">
                  <ControlHeaderExpand
                    category="clean"
                    isDisabled={isEditing}
                    iconSvg={
                      <CleanIcon isDisabled={isEditing} />
                    }
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
                            // isDisabled={!hasElevations}
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
                            key={'split different movements'}
                            type="split"
                            criteria="different movements"
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
                    isDisabled={showModal}
                    // isDisabled={true}
                    cb={handleOnEditClick}
                    iconSvg={
                      <EditIcon isDisabled={showModal} />
                    }
                  />
                </Control>
                <Control position="topleft">
                  <ControlItem
                    key={'history undo'}
                    type="history"
                    criteria="undo"
                    title="Undo"
                    isDisabled={!hasUndo}
                    cb={handleUndo}
                    iconSvg={
                      <UndoRedoIcon isDisabled={!hasUndo} />
                    }
                  />
                  <ControlItem
                    key={'history redo'}
                    type="history"
                    criteria="redo"
                    title="Redo"
                    isDisabled={!hasRedo}
                    cb={handleRedo}
                    iconSvg={
                      <UndoRedoIcon redo={true} isDisabled={!hasRedo} />
                    }
                  />
                </Control>
                <Control position="bottomright" prepend>
                  <ControlHeaderExpand
                    key={'graph'}
                    category="graph"
                    title="Show Graph"
                    children={[]}
                    isDisabled={showModal}
                    // isDisabled={true}
                    cb={handleGraphClick}
                    iconSvg={
                      <GraphIcon isDisabled={showModal} />
                    }
                  />
                </Control>
              </>
              : null}

            {(trackStats !== null) ?
              <>
                <Control position="topright">
                  <TrackStatsControl
                    key={'stats'}
                    category="stats"
                    title="Show stats"
                    stats={trackStats}
                    children={[]}
                    isDisabled={showModal}
                    // isDisabled={true}
                    cb={handleShowTrackStats}
                    iconSvg={
                      <StatsIcon isDisabled={showModal} />
                    }
                  />
                </Control>
              </>
              : null}


            {(layers.baseLayers?.length > 1 || layers.overlays?.length) ?
              <LayersControl {...layers} />
              : null}

            {bounds ? <SetViewOnTrackLoad bounds={bounds} /> : null}
            <SetViewOnClick animateRef={animateRef} />
          </MapContainer>

          {showGraph ?
            <div className="graph">
              Track Graph to be added in next version
            </div>
            : null}

          {isEditing ?
            <div className="bottom-center control">
              <div className="editing-label">Editing</div>
            </div>
            : null}

          {showTrackCriteriaModal ?
            <Modal
              setShow={handleShowTrackCriteria}
              buttons={[]}
              title={'Track Criteria'}
            >
              <div className="stats-container">
                {config.trackCriteria ?
                  <TrackCriteria
                    criteria={config.trackCriteria}
                    title={"Specified"}
                    level={3}
                  /> : null
                }
                {config.trackCriteriaNormalized ?
                  <TrackCriteria
                    criteria={config.trackCriteriaNormalized}
                    title={"Normalized"}
                    level={3}
                  /> : null
                }
              </div>
            </Modal>
            : null}

          {showFileReplaceModal ?
            <Modal
              setShow={handleFileReplaceDialog}
              buttons={[
                {
                  label: 'Replace',
                  callback: () => {
                    console.log('Replace')
                    // TODO: Handle case of re-selecting existing file after cancelling in this modal.
                    // acceptCurrentFile(true);
                    swapTracks();
                    handleFileReplaceDialog(false);
                  }
                }, {
                  label: 'Merge',
                  callback: () => {
                    console.log('Merge')
                    // TODO: Handle case of re-selecting existing file after cancelling in this modal.
                    // TODO: Handle case of not reloading a prior loaded file. Maybe have a list of loaded names?
                    // acceptCurrentFile(true);
                    loadTrack();
                    handleFileReplaceDialog(false);
                  }
                }, {
                  label: 'Cancel',
                  callback: () => {
                    console.log('Cancel')
                    // TODO: Handle case of re-selecting existing file after cancelling here.
                    // acceptCurrentFile(false);
                    handleFileReplaceDialog(false);
                  }
                }
              ]}
              title={'Warning!'}
            >
              <p>Tracks already exist.</p>
              <p>Please select from the following actions:</p>
            </Modal>
            : null}

          {showElevationApiModal ?
            <Modal
              setShow={handleElevationApiDialog}
              buttons={[{
                label: 'Fetch from API',
                callback: async () => {
                  await handleGetCachedElevation();
                  // await handleGetApiElevation(); // TODO: Activate this & remove cached elevations method once API fixed
                  handleSmoothByElevationWithElevations();
                  handleElevationApiDialog(false);
                }
              }, {
                label: 'Use existing',
                callback: async () => {
                  handleSmoothByElevationWithElevations();
                  handleElevationApiDialog(false);
                }
              }, {
                label: 'Cancel',
                callback: () => {
                  handleElevationApiDialog(false);
                }
              }
              ]}
              title={'Elevations'}
            >
              <p>Some Track Points are missing terrain elevations. <br />
                Stats may be off if using incomplete or GPS-recorded altitudes.</p>
            </Modal>
            : null}
        </div >
        <br />
        <hr />

        <input type="button" disabled onClick={handleGetApiElevation} value="Get Elevation Data from API" />
        {!currentTrack
          ? <input type="button" disabled value="Get Cached Elevation Data" />
          : <input type="button" onClick={handleGetCachedElevation} value="Get Cached Elevation Data" />
        }

        <br />
        <hr />
      </>
      : null
  )
}
