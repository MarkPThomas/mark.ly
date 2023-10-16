import React, { useEffect, useState, useRef } from 'react';
import {
  LatLngBoundsExpression,
  LatLngTuple
} from 'leaflet';
import { MapContainer } from 'react-leaflet';
import {
  GeoJSON,
  FeatureCollection as FeatureCollectionSerial
} from 'geojson';

import { Conversion } from '../../../../../common/utils/units/conversion/Conversion';

import {
  toGeoJson,
  toGpxFile,
  toKmlFile
} from '../../model/Files';

import { FeatureCollection } from '../../model/GeoJSON';

import {
  GeoJsonManager
} from '../../model/GIS';

import {
  Track,
  TrackPoint,
  TrackPoints
} from '../../model/GIS/Track';

import {
  StationarySmoother,
  SpeedSmoother,
  NoiseCloudSmoother,
  AngularSpeedSmoother,
  ElevationSpeedSmoother
} from '../../model/GIS/Smooth';

import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';
import { CruftManager } from '../../model/GIS/Cruft/CruftManager';


export type MapProps = {
  initialPosition: {
    point: LatLngTuple,
    zoom: number
  },
  initialLayers?: LayersControlProps
};

export const Map = ({ initialPosition, initialLayers }: MapProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [layersProps, setLayersProps] = useState(initialLayers)
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);

  const [layer, setLayer] = useState<GeoJSON>(null);
  const [coords, setCoords] = useState<TrackPoints | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  // TODO: Work out how this update should work when underlying geoJson is automatically updated
  const updateFromGeoJson = (geoJson: FeatureCollectionSerial, newCoords: TrackPoint[]) => {
    setLayer(geoJson);
    setCoords(newCoords);
    setLayersProps(updatedLayersProps(geoJson, newCoords));

    console.log('geoJson: ', layer);
    // TODO: Fixed boundingBox update. Not being marked as dirty
    const newBounds = track.boundingBox().toCornerLatLng();
    console.log('newBounds: ', newBounds);
    setBounds(newBounds);
  }

  const updateFromTrack = (track: Track) => {
    console.log('Track: ', track);

    const newCoords = track.trackPoints();
    // const geoJson = updateGeoJsonTrackByCoords(layer as GeoJSONFeatureCollection, newCoords);
    // console.log('geoJson: ', geoJson);
    // updateFromGeoJson(geoJson, newCoords);

    updateFromGeoJson(layer as FeatureCollectionSerial, newCoords);
  }

  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
    console.log('Read file: ', file);

    toGeoJson(file, [
      // save converted geojson to hook state
      setLayer,
      (geoJson: FeatureCollectionSerial) => {
        console.log('Layer: ', geoJson)

        // save converted geoJson to hook within Track
        // Generate track for CRUD that is reflected in geoJson via hooks
        const featureCollection = FeatureCollection.fromJson(geoJson);
        const geoJsonMngr = new GeoJsonManager(featureCollection);
        const track = geoJsonMngr.TrackFromGeoJson();

        // TODO: Can withold this to when user selects to enter 'Trackly' mode for editing.
        track.addProperties();

        if (track) {
          setTrack(track);

          const newCoords = track.trackPoints();
          console.log('newCoords: ', newCoords);
          setCoords(newCoords);
          setLayersProps(updatedLayersProps(geoJson, newCoords));

          const newBounds = track.boundingBox().toCornerLatLng();
          console.log('newBounds: ', newBounds);
          setBounds(newBounds);
        }

        // const newCoords = getCoords(geoJson);
        // console.log('newCoords: ', newCoords);
        // setCoords(newCoords);
        // setLayersProps(updatedLayersProps(geoJson, newCoords));

        // const newBounds = BoundingBox.fromPoints(newCoords).toCornerPoints();
        // console.log('newBounds: ', newBounds);
        // setBounds(newBounds);
      }]);
  };

  const handleGPXSaveFile = () => {
    toGpxFile(layer);
  }

  const handleKMLSaveFile = () => {
    toKmlFile(layer);
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
    if (layer as FeatureCollectionSerial && track) {
      const manager = new CruftManager(track);

      const triggerDistanceKM: number = 5;
      const trimmedTrack = manager.trimTrackSegmentCruft(triggerDistanceKM);

      // TODO: Shim
      // Remove once updating behavior is validated, e.g. is returned track needed?
      const geoJson = trimmedTrack.toJson();
      const newCoords = trimmedTrack.trackPoints();

      updateFromGeoJson(geoJson, newCoords);
    }
  }

  const handleSmoothStationary = () => {
    console.log('handleSmoothStationary')
    if (layer as FeatureCollectionSerial && track) {
      const manager = new StationarySmoother(track);

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      let numberNodesRemoved = manager.smoothStationary(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothBySpeed = () => {
    console.log('handleSmoothBySpeed')
    if (layer as FeatureCollectionSerial && track) {
      const manager = new SpeedSmoother(track);

      const speedLimitKph = Conversion.Speed.mphToKph(4);
      const speedLimitMpS = Conversion.Speed.kphToMetersPerSecond(speedLimitKph);

      let numberNodesRemoved = manager.smoothBySpeed(speedLimitMpS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothByAngularSpeed = () => {
    console.log('handleSmoothByAngularSpeed')
    if (layer as FeatureCollectionSerial && track) {
      const manager = new AngularSpeedSmoother(track);

      //1.0472; // 60 deg/sec = 3 seconds to walk around a switchback
      const angularSpeedLimitRadS = 1.0472;

      let numberNodesRemoved = manager.smoothByAngularSpeed(angularSpeedLimitRadS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothNoiseCloud = () => {
    console.log('handleSmoothNoiseCloud')
    if (layer as FeatureCollectionSerial && track) {
      const manager = new NoiseCloudSmoother(track);

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      let numberNodesRemoved = manager.smoothNoiseClouds(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleGetElevation = () => {
    console.log('handleGetElevation')
    if (layer as FeatureCollectionSerial && track) {
      track.addElevationsFromApi();

      updateFromTrack(track);
    }
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    if (layer as FeatureCollectionSerial && track) {
      const manager = new ElevationSpeedSmoother(track);

      //0.254 meters/second = 3000 ft / hr
      const ascentSpeedLimitMPS = 0.254;
      const descentSpeedLimitMPS = 1.5 * ascentSpeedLimitMPS;

      let numberNodesRemoved = manager.smoothByElevationSpeed(ascentSpeedLimitMPS, descentSpeedLimitMPS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const updatedLayersProps = (
    layer: FeatureCollectionSerial,
    coords
  ): LayersControlProps =>
    layer ? {
      ...initialLayers,
      overlays: [{
        name: 'Track',
        geoJSON: layer,
        items: [
          coords
        ]
      }]
    } : layersProps;

  console.log('layersProps:', layersProps)

  return (
    <div id="map-container">
      <MapContainer
        center={position.point}
        zoom={position.zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '900px' }}
      >
        {initialLayers.baseLayers[0].item}
        <MiniMapControl position={POSITION_CLASSES.bottomright} zoom={Math.floor(position.zoom / 3)} />
        {
          (layersProps.baseLayers?.length > 1 || layersProps.overlays?.length)
            ?
            <LayersControl {...layersProps} />
            : null
        }
        <SetViewOnClick animateRef={animateRef} />
        <SetViewOnTrackLoad bounds={bounds} />
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
    </div>
  )
}
