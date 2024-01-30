import { useEffect, useState } from 'react';
import {
  LatLngBoundsExpression,
  LatLngTuple,
  Layer
} from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { Feature, FeatureCollection as FeatureCollectionSerial, Geometry } from 'geojson';
import Control from "react-leaflet-custom-control";

import cachedData from '../../../../server/data/gpsRaw/2023-07-05 - Elevation Data API Response.json';

import { StateHistory } from '../../../../../common/utils/history/StateHistory';

import { toGeoJson } from '../../model/Files';
import { GeoJsonManager } from '../../model/GIS';
import { IActivity, ISplit, ITrackCriteria } from '../../model/GIS/settings';
import { Track } from '../../model/GIS/Core/Track';
import { ISplitResult } from '../../model/GIS/Actions/Split/SplitManager';

import { Settings } from '../../Settings';

import { createTileLayers, appendTilesApiKey } from './Layers/TileLayers';
import { POSITION_CLASSES } from './LeafletControls/controlSettings';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnLoad } from './LeafletControls/SetViewOnLoad';
import { getCleanCallbacks } from './LeafletControls/Custom/Clean/CleanCallbacks';

import { MiniMapControl } from './LeafletControls/MiniMap/MiniMapControl';
import { IOverlay, LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';

import { ControlCenter } from './LeafletControls/Custom/Controls/ControlCenter';
import { PreviewControl } from './LeafletControls/Custom/Preview/PreviewControl';
import { PathSelectedControl } from './LeafletControls/Custom/PathSelected/PathSelectedControl';
import { EditingControl } from './LeafletControls/Custom/Editing/EditingControl';
import { HistoryControls } from './LeafletControls/Custom/History/HistoryControls';
import { PathGraphControl } from './LeafletControls/Custom/PathGraph/PathGraphControl';
import { StatsControl } from './LeafletControls/Custom/Stats/StatsControl';
import { FileControl } from './LeafletControls/Custom/File/FileControl';
import { OptionsControl } from './LeafletControls/Custom/Options/OptionsControl';
import { ICheckboxGroup } from './LeafletControls/Custom/Options/CheckboxGroup';
import { IDialogGroup } from './LeafletControls/Custom/Options/DialogGroup';
import { CleanControls, ICleanGroup } from './LeafletControls/Custom/Clean/CleanControls';

import { Modal } from '../shared/components/Modal';
import Dialog from '../shared/components/Dialog';
import { TrackCriteriaModal } from './LeafletControls/Custom/Modals/TrackCriteriaModal';
import { FileReplaceModal } from './LeafletControls/Custom/Modals/FileReplaceModal';
import { ElevationsModal } from './LeafletControls/Custom/Modals/ElevationsModal';

import { PolylineComparisonDisplay } from './LeafletControls/Custom/Stats/PolylineComparisonDisplay';
import { GeoJsonPreview } from './Layers/GeoJsonPreview';
import { PathGraphDisplay } from './LeafletControls/Custom/PathGraph/PathGraphDisplay';
import { EditingDisplay } from './LeafletControls/Custom/Editing/EditingDisplay';

import { IEditedStats } from './Custom/Stats/Paths/Stats';

import './Map.css';

export interface IInitialPosition {
  point: LatLngTuple,
  zoom: number
}

export type MapProps = {
  config: Settings,
  restHandlers?
};

export const Map = ({ config, restHandlers }: MapProps) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const updateWindowDimensions = () => {
    setWindowHeight(window.innerHeight - 28);
    console.log('Window height is: ', window.innerHeight)
  };

  useEffect(() => {
    // Set initial window height
    updateWindowDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateWindowDimensions);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []); // Empty dependency array to run effect only on mount and unmount


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

  // == Previews ==
  const handleIsShowingPreview = () => {
    setIsShowingPreview(!isShowingPreview);
  }

  const handleAcceptPreview = () => {
    setIsShowingPreview(false);
    acceptNewTracks(previewTracks);
  }

  const handleRejectPreview = () => {
    setIsShowingPreview(false);
  }

  const acceptNewTracks = (tracks: Track[]) => {
    removeTrack(currentTrack);
    addTracks(tracks);

    const newCurrentTrack = tracks[0];
    changeCurrentTrack(newCurrentTrack);
    updateFromTrack(newCurrentTrack, false);
  }

  // == Updates ==
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

  const updateTrackState = (currentTrackState: Track) => {
    setCurrentTrack(currentTrackState);

    tracks[currentTrackState.id] = currentTrackState;
    setTracks(tracks);

    updateFromTrack(currentTrackState);
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



  // == Elevations ==
  const handleElevationApiDialog = (show: boolean) => {
    setShowModal(show);
    setShowElevationApiModal(show);
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


  // == Command Pattern ==
  const handleCmd = (command: () => void) => {
    if (command) {
      history.executeCmd(getKey(), currentTrack.clone(), command);
      console.log('handleCmd: ', history)
      setHistory(history);
    }
  }

  const getKey = (): string => {
    return currentTrack?.id;
  }


  // == Controls ==
  // ==== Files Control ====
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

  // ==== Options Control ====
  const handleShowTrackCriteria = () => {
    setShowTrackCriteriaModal(!showTrackCriteriaModal);
  }

  const optionDialogItems: IDialogGroup = {
    title: 'Config',
    items: [
      {
        name: 'Track Criteria',
        cb: handleShowTrackCriteria
      }
    ]
  };


  const handleShowComparisonStats = () => {
    setShowComparisonStats(!showComparisonStats);
    console.log('Toggled showComparisonStats!', showComparisonStats);
  }

  const handleShowTrackPoints = () => {
    setShowTrackPoints(!showTrackPoints);
    setLayers(updateLayersProps(currentTrack, !showTrackPoints));
  }

  const optionDisplayItems: ICheckboxGroup = {
    title: 'Display',
    items: [
      {
        name: 'Show Comparison Stats',
        isChecked: showComparisonStats,
        cb: handleShowComparisonStats
      },
      {
        name: 'Show TrackPoints',
        isChecked: showTrackPoints,
        cb: handleShowTrackPoints
      },
    ]
  };


  const handleSetViewOnClick = () => {
    setAnimateRef(!animateRef);
  }

  const handleShowPreview = () => {
    setShowPreview(!showPreview);
  }

  const optionMiscItems: ICheckboxGroup = {
    title: 'Misc',
    items: [
      {
        name: 'Animate Click Move',
        isChecked: animateRef,
        cb: handleSetViewOnClick
      },
      {
        name: 'Show Clean Previews',
        isChecked: showPreview,
        cb: handleShowPreview
      },
    ]
  };

  // ==== Cleaning Control ====
  const handleClean = (
    cleanCb: (track: Track, criteria: {}) => number,
    criteria: {}
  ) => {
    if (currentTrack) {
      handleCmd(() => {
        const cleanResults = cleanCb(currentTrack, criteria);
        acceptCleanResults(cleanResults, currentTrack);
      });
    }
  }

  const handleNoiseCloud = (
    noiseCloudCb: (track: Track, criteria: ITrackCriteria) => { nodes: number; clouds: number; },
    criteria: ITrackCriteria
  ) => {
    if (currentTrack) {
      handleCmd(() => {
        const cleanResults = noiseCloudCb(currentTrack, criteria);
        const numResults = Math.max(cleanResults.clouds, cleanResults.nodes);
        acceptCleanResults(numResults, currentTrack);
      });
    }
  }

  const acceptCleanResults = (cleanResults: number, track: Track) => {
    if (cleanResults) {
      updateFromTrack(track);
    }
  }

  // TODO: Note that undo history is lost before this.
  // Should it be retained? Or a warning modal given? A preview shown? Or nothing?
  const handleSplitWithPreview = (
    splitCb: (track: Track, criteria: ISplit | IActivity) => ISplitResult,
    criteria: ISplit | IActivity
  ) => {

    if (currentTrack) {
      if (showPreview) {
        const splitResults = splitCb(currentTrack.clone(), criteria);
        saveSplitResultsPreview(splitResults);
      } else {
        handleSplit(splitCb, criteria);
      }
    }
  }

  const handleSplit = (
    splitCb: (track: Track, criteria: ISplit | IActivity) => ISplitResult,
    criteria: ISplit | IActivity
  ) => {
    if (currentTrack) {
      handleCmd(() => {
        const cleanResults = splitCb(currentTrack, criteria);
        acceptSplitResults(cleanResults);
      });
    }
  }

  const saveSplitResultsPreview = (splitResults: ISplitResult) => {
    if (splitResults.tracks.length > 1) {
      setPreviewTracks(splitResults.tracks);
      setPreviewPoints(splitResults.points);
      setPreviewSegments(splitResults.segments);
      handleIsShowingPreview();
    }
  }

  const acceptSplitResults = (splitResults: ISplitResult) => {
    if (splitResults.tracks.length > 1) {
      acceptNewTracks(splitResults.tracks);
    }
  }



  const cleanCallbacks = getCleanCallbacks(
    config.trackCriteriaNormalized.activities.hiking,
    config.trackCriteriaNormalized,
    handleClean,
    handleNoiseCloud,
    handleSplitWithPreview
  );

  const handleSmoothByElevationWithElevations = () => {
    cleanCallbacks.smooth.elevationSpeed.cb()
  }

  const handleSmoothByElevation = () => {
    if (currentTrack) {
      if (!hasElevations) {
        setShowElevationApiModal(true);
      } else {
        handleSmoothByElevationWithElevations();
      }
    }
  }

  const cleanTrim: ICleanGroup = {
    type: 'trim',
    items: Object.values(cleanCallbacks.trim).map((item) => item)
  };

  const cleanSmooth: ICleanGroup = {
    type: 'smooth',
    items: Object.values(cleanCallbacks.smooth).map((item) => {
      if (item.criteria !== cleanCallbacks.smooth.elevationSpeed.criteria) {
        return item;
      } else {
        return {
          criteria: item.criteria,
          cb: handleSmoothByElevation
        }
      }
    })
  };

  const cleanSplit: ICleanGroup = {
    type: 'split',
    items: Object.values(cleanCallbacks.split).map((item) => item)
  };

  const cleanGroups: ICleanGroup[] = [
    cleanTrim,
    cleanSmooth,
    cleanSplit
  ];

  // ==== Editing Control ====
  const handleOnEditClick = () => {
    setIsEditing(!isEditing)
  }

  // ==== History Control ====
  const hasUndo = history?.hasUndo(getKey());
  const handleUndo = () => {
    const key = getKey();
    const state = history.undo(key, currentTrack);

    setHistory(history);

    updateTrackState(state);
  }

  const hasRedo = history?.hasRedo(getKey());
  const handleRedo = () => {
    const key = getKey();
    const state = history.redo(key, currentTrack);

    setHistory(history);

    updateTrackState(state);
  }

  // ==== Path Graph Control ====
  const handleGraphClick = () => {
    setShowGraph(!showGraph);
  }


  console.log('layersProps:', layers)
  const tracksValues = Object.values(tracks);
  const isGlobalDisabled = showModal || isShowingPreview;
  const showControlTopCenter = currentTrack || (showComparisonStats && originalTrackStats);
  const showControlBottomCenter = isEditing || isShowingPreview;

  return (
    layers ?
      <>
        <div id="map-container" style={{ width: '100%', height: windowHeight }}>
          {showControlTopCenter ?
            <ControlCenter position={'top'}>
              {currentTrack ?
                <PathSelectedControl
                  currentTrack={currentTrack}
                  tracksValues={tracksValues}
                  handleTrackSelection={handleTrackSelection}
                />
                : null}
              {(showComparisonStats && originalTrackStats) ?
                <PolylineComparisonDisplay statsInitial={originalTrackStats} statsCurrent={trackStats} />
                : null}
            </ControlCenter>
            : null}

          <MapContainer
            center={position.point}
            zoom={position.zoom}
            scrollWheelZoom={false}
          >
            {layers.baseLayers[0].item}
            <MiniMapControl
              position={POSITION_CLASSES.bottomright}
              zoom={Math.floor(position.zoom / 2)}
              tileSourceUrl={config.miniMap.url}
            />
            {/* Keep this control component here. For some reason the zoom control margin is broken without it. */}
            <Control position="topleft" prepend />
            <FileControl track={currentTrack} onFileSelection={handleFileSelection} />
            <OptionsControl
              dialogGroups={[optionDialogItems]}
              checkboxGroups={[optionDisplayItems, optionMiscItems]}
            />
            {currentTrack ?
              <>
                <CleanControls isDisabled={isGlobalDisabled || isEditing}
                  groups={cleanGroups}
                />
                {/* <Control position="topleft">
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
                </Control> */}
                <EditingControl isDisabled={isGlobalDisabled} onClick={handleOnEditClick} />
                <HistoryControls isDisabled={isGlobalDisabled} hasUndo={hasUndo} hasRedo={hasRedo} onUndo={handleUndo} onRedo={handleRedo} />
                <PathGraphControl isDisabled={isGlobalDisabled} onClick={handleGraphClick} position="bottomright" prepend />
              </>
              : null}

            {trackStats ?
              <StatsControl isDisabled={isGlobalDisabled} stats={trackStats} position="topright" /> : null}

            {(layers.baseLayers?.length > 1 || layers.overlays?.length) ?
              <LayersControl {...layers} /> : null}

            {isShowingPreview ?
              <GeoJsonPreview tracks={previewTracks} /> : null}
            {bounds ?
              <SetViewOnLoad bounds={bounds} /> : null}
            <SetViewOnClick animateRef={animateRef} />
          </MapContainer>

          {showControlBottomCenter ?
            <ControlCenter position={'bottom'}>
              {isEditing ?
                <EditingDisplay /> : null}
              {isShowingPreview ?
                <PreviewControl cbAccept={handleAcceptPreview} cbReject={handleRejectPreview} /> : null}
            </ControlCenter> : null
          }
        </div >

        {/* TODO: When adding graph, subtract it's height from windowHeight for the map */}
        {showGraph ?
          <PathGraphDisplay /> : null}

        {showTrackCriteriaModal ?
          <TrackCriteriaModal
            handleShow={handleShowTrackCriteria}
            trackCriteria={config.trackCriteria}
            trackCriteriaNormalized={config.trackCriteriaNormalized}
          /> : null}

        {showFileReplaceModal ?
          <FileReplaceModal
            handleFileReplaceDialog={handleFileReplaceDialog}
            swapTracks={swapTracks}
            loadTrack={loadTrack}
          /> : null}

        {showElevationApiModal ?
          <ElevationsModal
            handleElevationApiDialog={handleElevationApiDialog}
            handleGetElevation={handleGetCachedElevation}  // handleGetApiElevation(); // TODO: Activate this & remove cached elevations method once API fixed
            handleSmoothByElevationWithElevations={handleSmoothByElevationWithElevations} /> : null}
      </>
      : null
  )
}
