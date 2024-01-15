import { useEffect, useState } from 'react';
import {
  LatLngBoundsExpression,
  LatLngTuple,
  Layer
} from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { Feature, FeatureCollection as FeatureCollectionSerial, Geometry } from 'geojson';
import Control from "react-leaflet-custom-control";


import { Conversion } from '../../../../../common/utils/units/conversion/Conversion';
import { StateHistory } from '../../../../../common/utils/history/StateHistory';

import {
  toGeoJson,
  toGpxFile,
  toKmlFile
} from '../../model/Files';

import { GeoJsonManager } from '../../model/GIS';
import { ITrackCriteria } from '../../model/GIS/settings';
import { Track, TrackPoint, TrackSegment } from '../../model/GIS/Core/Track';
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
import { IOverlay, LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
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
import { GeoJsonPreview } from './Layers/GeoJsonPreview';

export interface IInitialPosition {
  point: LatLngTuple,
  zoom: number
}

export type MapProps = {
  config: Settings,
  restHandlers?
};

export const Map = ({ config, restHandlers }: MapProps) => {
  const [sessionId, setSessionId] = useState<number>(1);

  const [position, setPosition] = useState<IInitialPosition>(config.initialPosition);
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);

  const [trackCriteria, setTrackCriteria] = useState<ITrackCriteria>(config.trackCriteriaNormalized);
  const [showTrackCriteriaModal, setShowTrackCriteriaModal] = useState<boolean>(false);

  const [layers, setLayers] = useState<LayersControlProps | null>(null)
  const [showTrackPoints, setShowTrackPoints] = useState<boolean>(true);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<{ [key: string]: Track }>({});
  const [history, setHistory] = useState<StateHistory<Track>>(new StateHistory<Track>());

  const [originalTrackStats, setOriginalTrackStats] = useState<IEditedStats>(null);
  const [showComparisonStats, setShowComparisonStats] = useState<boolean>(true);

  const [trackStats, setTrackStats] = useState<IEditedStats>(null);

  const [previewTracks, setPreviewTracks] = useState<Track[]>(null);
  const [previewPoints, setPreviewPoints] = useState<any[]>(null);
  const [previewSegments, setPreviewSegments] = useState<any[]>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isShowingPreview, setIsShowingPreview] = useState<boolean>(false);


  const [animateRef, setAnimateRef] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasElevations, setHasElevations] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [currentFile, setCurrentFile] = useState<File>(null);
  const [showFileReplaceModal, setShowFileReplaceModal] = useState<boolean>(false);

  const [showElevationApiModal, setShowElevationApiModal] = useState<boolean>(false);
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

  const handleIsShowingPreview = () => {
    setIsShowingPreview(!isShowingPreview);
  }

  const handleAccept = () => {
    setIsShowingPreview(false);

    removeTrack(currentTrack);
    addTracks(previewTracks);

    const newCurrentTrack = previewTracks[0];
    changeCurrentTrack(newCurrentTrack);
    updateFromTrack(newCurrentTrack, false);
  }

  const handleReject = () => {
    setIsShowingPreview(false);
  }

  const handleShowTrackPoints = () => {
    setShowTrackPoints(!showTrackPoints);
    setLayers(updateLayersProps(currentTrack, !showTrackPoints));
  }

  const handleShowTrackCriteria = () => {
    setShowTrackCriteriaModal(!showTrackCriteriaModal);
  }

  const handleShowComparisonStats = () => {
    setShowComparisonStats(!showComparisonStats);
    console.log('Toggled showComparisonStats!', showComparisonStats);
  }

  const handleOnEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleGraphClick = () => {
    setShowGraph(!showGraph);
  }

  const updateFromTrack = (track: Track, updateStats: boolean = true) => {
    console.log('updateFromTrack');
    console.log('Track: ', track);
    console.log('currentTrack: ', currentTrack);
    console.log('Tracks: ', tracks);

    setLayers(updateLayersProps(track));

    const newBounds = track.boundingBox().toCornerLatLng();
    setBounds(newBounds);

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

  const updateLayersProps = (selectedTrack?: Track, showTrackPoints: boolean = true): LayersControlProps => {
    const overlays: IOverlay[] = Object.values(tracks).map((track) => overlayDefinition(track));
    console.log('updateLayersProps->overlays: ', overlays)

    const layersProps = overlays.length ? {
      ...layers,
      overlays,
      selectedTrack: selectedTrack ?? currentTrack,
      showTrackPoints
    } : layers;
    console.log('layersProps: ', layersProps)

    return layersProps;
  }


  const overlayDefinition = (track: Track): IOverlay => {
    const coords = track.trackPoints();
    const segments = track.trackSegments();
    const geoJson = track.toJson();
    const trackName = track.name;

    console.log('newCoords: ', coords);
    console.log('newGeoJson: ', geoJson);
    console.log('trackName: ', trackName);

    const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
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
      if (track.id !== currentTrack.id) {
        const selectedTrack = tracks[track.id];
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
    const tracksModify = tracks;

    if (newTracks.length) {
      let id = sessionId;
      newTracks.forEach((track) => {
        track.id = id.toString();
        tracksModify[track.id] = track;
        history.addHistorySet(track.id);
        id++;
      });
      setHistory(history);
      setSessionId(id);
    }

    setTracks(tracksModify);
  }

  const removeTrack = (track: Track) => {
    const tracksModify = tracks;

    if (currentTrack === track) {
      changeCurrentTrackToNext(track);
    }

    delete tracksModify[track.id];

    setTracks(tracksModify);
  }

  const changeCurrentTrackToNext = (track: Track) => {
    const trackIds = Object.keys(tracks);

    if (trackIds) {
      const sortedIds = trackIds.sort();
      const trackIndex = sortedIds.indexOf(track.id);
      const nextTrack = tracks[trackIndex + 1] ?? null;

      changeCurrentTrack(nextTrack);
    }
  }

  const handleTrackSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTrackId = e.target.value;
    const selectedTrack = tracks[selectedTrackId];
    changeCurrentTrack(selectedTrack);
  }

  const changeCurrentTrack = (track: Track) => {
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
    } else {
      console.log('Loading file!');
      toGeoJson(file, [loadGeoJsonAsTrack]);
    }
  }

  const loadGeoJsonAsTrack = (geoJson: FeatureCollectionSerial) => {
    console.log('geoJson/Layer: ', geoJson)

    const track = GeoJsonManager.TrackFromJson(geoJson);

    if (track) {
      track.addProperties();

      changeCurrentTrack(track);
      addTracks([track]);

      updateFromTrack(track, false);

      const trackStats = track.getStats();
      setOriginalTrackStats(trackStats);
    }
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

  // TODO: Note that undo history is lost before this.
  // Should it be retained? Or a warning modal given? A preview shown? Or nothing?
  const handleSplitOnStop = () => {
    console.log('handleSplitOnStop')
    if (currentTrack) {
      if (showPreview) {
        const splitResults = splitOnStop(currentTrack.clone());
        if (splitResults.tracks.length > 1) {
          setPreviewTracks(splitResults.tracks);
          setPreviewPoints(splitResults.points);
          setPreviewSegments(splitResults.segments);
          handleIsShowingPreview();
        }
      } else {
        handleCmd(() => {
          const splitResults = splitOnStop(currentTrack);

          // console.log(`number tracks returned: ${splitResults.tracks.length}`);
          // console.log(`number segments split on: ${splitResults.segments.length}`);
          // console.log(`number points split by: ${splitResults.points.length}`);

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
  }

  const splitOnStop = (track: Track) => {
    if (track) {
      const manager = new DurationSplitter(track);

      const maxStopDurationS = trackCriteria.split.stopDurationMax;
      const minMoveDurationS = trackCriteria.split.moveDurationMin;
      return manager.splitByMaxDuration(maxStopDurationS, minMoveDurationS);
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

  const handleUndo = () => {
    const key = getKey();
    const state = history.undo(key, currentTrack);

    console.log('Undo: ', history)
    setHistory(history);

    updateTrackState(state);
  }

  const handleRedo = () => {
    const key = getKey();
    const state = history.redo(key, currentTrack);

    console.log('Redo: ', history)
    setHistory(history);

    updateTrackState(state);
  }


  const updateTrackState = (currentTrackState: Track) => {
    console.log('prior # vertices: ', currentTrack.trackPoints().length)
    console.log('currentTrackState: ', currentTrackState);
    console.log('# vertices: ', currentTrackState.trackPoints().length)

    setCurrentTrack(currentTrackState);

    tracks[currentTrackState.id] = currentTrackState;
    setTracks(tracks);

    updateFromTrack(currentTrackState);
  }

  const getKey = (): string => {
    return currentTrack?.id;
  }

  const hasUndo = history?.hasUndo(getKey());
  const hasRedo = history?.hasRedo(getKey());


  console.log('layersProps:', layers)

  const tracksValues = Object.values(tracks);

  const isGlobalDisabled = showModal || isShowingPreview;

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
                    <select name="tracks" id="tracks-selection" value={currentTrack.id} onChange={handleTrackSelection}>
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
              {/* Keep this control component here. For some reason the zoom control margin is broken without it. */}
            </Control>
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
                    <div key="showTrackPoints">
                      <input type="checkbox" onChange={handleShowTrackPoints} id="showTrackPoints" checked={showTrackPoints} />
                      <label htmlFor="showTrackPoints">Show TrackPoints</label>
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
            {currentTrack ?
              <>
                <Control position="topleft">
                  <ControlHeaderExpand
                    category="clean"
                    isDisabled={isEditing || isGlobalDisabled}
                    iconSvg={
                      <CleanIcon isDisabled={isEditing || isGlobalDisabled} />
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
                    isDisabled={isGlobalDisabled}
                    cb={handleOnEditClick}
                    iconSvg={
                      <EditIcon isDisabled={isGlobalDisabled} />
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
                      <UndoRedoIcon isDisabled={!hasUndo || isGlobalDisabled} />
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
                      <UndoRedoIcon redo={true} isDisabled={!hasRedo || isGlobalDisabled} />
                    }
                  />
                </Control>
                <Control position="bottomright" prepend>
                  <ControlHeaderExpand
                    key={'graph'}
                    category="graph"
                    title="Show Graph"
                    children={[]}
                    isDisabled={isGlobalDisabled}
                    // isDisabled={true}
                    cb={handleGraphClick}
                    iconSvg={
                      <GraphIcon isDisabled={isGlobalDisabled} />
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
                    isDisabled={isGlobalDisabled}
                    iconSvg={
                      <StatsIcon isDisabled={isGlobalDisabled} />
                    }
                  />
                </Control>
              </>
              : null}


            {(layers.baseLayers?.length > 1 || layers.overlays?.length) ?
              <LayersControl {...layers} />
              : null}


            {isShowingPreview ?
              <GeoJsonPreview tracks={previewTracks} />
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
              <div className="editing-label">Editing to be added in next version</div>
            </div>
            : null}

          {isShowingPreview ?
            <div className="bottom-center control">
              <div className="preview-label">
                <input type="button" onClick={handleAccept} value="Accept" />
                <input type="button" onClick={handleReject} value="Reject" />
              </div>
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
