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
} from '../../model/GIS/Track';

import {
  StationarySmoother,
  SpeedSmoother,
  NoiseCloudSmoother,
  AngularSpeedSmoother,
  ElevationSpeedSmoother
} from '../../model/GIS/Smooth';
import { CruftManager } from '../../model/GIS/Cruft/CruftManager';
import { ITrackCriteria } from '../../model/GIS/settings';

import { Settings } from '../../Settings';

import { createTileLayers, appendTilesApiKey } from './Layers/TileLayers';
import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';

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

  const [track, setTrack] = useState<Track | null>(null);

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
  const updateFromTrack = (track: Track) => {
    console.log('updateFromTrack');

    console.log('Track: ', track);

    const newCoords = track.trackPoints();
    console.log('newCoords: ', newCoords);

    const newGeoJson = track.toJson();
    console.log('newGeoJson: ', newGeoJson);

    const newBounds = track.boundingBox().toCornerLatLng();
    console.log('newBounds: ', newBounds);

    setLayers(updatedLayersProps(newGeoJson, newCoords));
    setBounds(newBounds);
  }

  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
    console.log('Read file: ', file);

    toGeoJson(file, [
      // save converted geojson to hook state
      // setLayer,
      (geoJson: FeatureCollectionSerial) => {
        console.log('geoJson/Layer: ', geoJson)

        // save converted geoJson to hook within Track
        // Generate track for CRUD that is reflected in geoJson via hooks
        const track = GeoJsonManager.TrackFromJson(geoJson);

        // TODO: Can withold this to when user selects to enter 'Trackly' mode for editing.
        track.addProperties();

        if (track) {
          setTrack(track);

          const newCoords = track.trackPoints();
          console.log('newCoords: ', newCoords);
          // setCoords(newCoords);
          setLayers(updatedLayersProps(geoJson, newCoords));

          const newBounds = track.boundingBox().toCornerLatLng();
          console.log('newBounds: ', newBounds);
          setBounds(newBounds);
        }
      }]);
  };

  const handleGPXSaveFile = () => {
    toGpxFile(track.toJson());
  }

  const handleKMLSaveFile = () => {
    toKmlFile(track.toJson());
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
    if (track) {
      const manager = new CruftManager(track);

      // const triggerDistanceM: number = 5000;
      const triggerDistanceM = trackCriteria.cruft.pointSeparationLimit;
      console.log('triggerDistanceM: ', triggerDistanceM)
      const numberTrimmed = manager.trimTrackByCruft(triggerDistanceM);

      console.log(`number nodes removed: ${numberTrimmed}`);

      updateFromTrack(track);
    }
  }

  const handleSmoothStationary = () => {
    console.log('handleSmoothStationary')
    if (track) {
      const manager = new StationarySmoother(track);

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      // const minSpeedMS = 0.11176;
      const minSpeedMS = trackCriteria.activities.hiking.speed.min;
      console.log('minSpeedMS: ', minSpeedMS)

      let numberNodesRemoved = manager.smoothStationary(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothBySpeed = () => {
    console.log('handleSmoothBySpeed')
    if (track) {
      const manager = new SpeedSmoother(track);

      // 1.78816 meters/sec = 4 mph
      const speedLimitKph = Conversion.Speed.mphToKph(4);
      const speedLimitMpS = Conversion.Speed.kphToMetersPerSecond(speedLimitKph);
      console.log('old speedLimitMS: ', speedLimitMpS)


      const speedLimitMS = trackCriteria.activities.hiking.speed.max;
      console.log('speedLimitMS: ', speedLimitMS)

      let numberNodesRemoved = manager.smoothBySpeed(speedLimitMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothByAngularSpeed = () => {
    console.log('handleSmoothByAngularSpeed')
    if (track) {
      const manager = new AngularSpeedSmoother(track);

      //1.0472; // 60 deg/sec = 3 seconds to walk around a switchback
      // const angularSpeedLimitRadS = 1.0472;
      const angularSpeedLimitRadS = trackCriteria.activities.hiking.rotation.angularVelocityMax;
      console.log('angularSpeedLimitRadS: ', angularSpeedLimitRadS)

      let numberNodesRemoved = manager.smoothByAngularSpeed(angularSpeedLimitRadS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothNoiseCloud = () => {
    console.log('handleSmoothNoiseCloud')
    if (track) {
      const gpsTimeIntervalS = trackCriteria.misc.gpsTimeInterval;
      console.log('gpsTimeIntervalS: ', gpsTimeIntervalS)
      const manager = new NoiseCloudSmoother(track, gpsTimeIntervalS);

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      // const minSpeedMS = 0.11176;
      const minSpeedMS = trackCriteria.noiseCloud.speedMin;
      console.log('minSpeedMS: ', minSpeedMS)

      let numberNodesRemoved = manager.smoothNoiseClouds(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleGetElevation = () => {
    console.log('handleGetElevation')
    if (track) {
      track.addElevationsFromApi();

      updateFromTrack(track);
    }
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    if (track) {
      const manager = new ElevationSpeedSmoother(track);

      //0.254 meters/second = 3000 ft / hr
      // const ascentSpeedLimitMPS = 0.254;
      // const descentSpeedLimitMPS = 1.5 * ascentSpeedLimitMPS;
      const ascentSpeedLimitMS = trackCriteria.activities.hiking.elevation.maxAscentRate;
      console.log('ascentSpeedLimitMS: ', ascentSpeedLimitMS)
      const descentSpeedLimitMS = trackCriteria.activities.hiking.elevation.maxDescentRate;
      console.log('descentSpeedLimitMS: ', descentSpeedLimitMS)

      let numberNodesRemoved = manager.smoothByElevationSpeed(ascentSpeedLimitMS, descentSpeedLimitMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const updatedLayersProps = (
    layer: FeatureCollectionSerial,
    coords: TrackPoint[]
  ): LayersControlProps =>
    layer ? {
      ...layers,
      overlays: [{
        name: 'Track',
        geoJSON: layer,
        items: [
          coords
        ]
      }]
    } : layers;

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
        <input type="file" onChange={handleFileSelection} />
        <input type="checkbox" onClick={handleSetViewOnClick} id="animatePan" value="animatePan" defaultChecked />
        <label htmlFor="animatePan">Set View On Click</label>
        {/* <input type="button" onClick={handleMergeTrackSegments} value="Merge Track Segments" /> */}

        {/* <input type="button" onClick={handleSplitCruft} value="Split Cruft" /> */}
        <input type="button" onClick={handleTrimCruft} value="Trim Cruft" />

        <input type="button" onClick={handleSmoothStationary} value="Smooth Stationary" />
        <input type="button" onClick={handleSmoothNoiseCloud} value="Smooth Noise Cloud" />

        <input type="button" onClick={handleSmoothBySpeed} value="Smooth by Speed" />
        <input type="button" onClick={handleSmoothByAngularSpeed} value="Smooth by Angular Speed" />

        {/* <input type="button" onClick={handleGetElevation} value="Get Elevation Data" /> */}
        {/* <input type="button" onClick={handleSmoothByElevation} value="Smooth by Elevation Rate" /> */}

        <input type="button" onClick={handleGPXSaveFile} value="Save as GPX File" />
        <input type="button" onClick={handleKMLSaveFile} value="Save as KML File" />
      </div> : null
  )
}
