import React, { useEffect, useState, useRef } from 'react';
import { LatLng, LatLngBoundsExpression, LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { FeatureCollection, GeoJSON, Geometry } from 'geojson';

import {
  toGeoJson, toGpxFile, toKmlFile
} from '../../model/Files';

import {
  GeoJSONFeatureCollection,
  clipTrackSegmentByCruft,
  BoundingBox,
  getCoords,
  mergeTackSegments,
  splitTrackSegmentByCruft,
  updateGeoJsonTrackByCoords,
  Track
} from '../../model/GIS';

import {
  TrackPoint,
  TrackPoints
} from '../../model/GIS/TrackPoint';

import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';
import { Conversion } from '../../../../../common/utils/units/conversion/Conversion';


export type MapProps = {
  initialPosition: {
    point: LatLngTuple,
    zoom: number
  },
  initialLayers?: LayersControlProps
};

export const Map = ({ initialPosition, initialLayers }: MapProps) => {
  const [layer, setLayer] = useState<GeoJSON>(null);
  const [coords, setCoords] = useState<TrackPoints | null>(null);
  const [layersProps, setLayersProps] = useState(initialLayers)
  const [bounds, setBounds] = useState<LatLngBoundsExpression | LatLngExpression | null>(null);
  const [position, setPosition] = useState(initialPosition);


  const updateFromGeoJson = (geoJson: GeoJSONFeatureCollection, newCoords: TrackPoint[]) => {
    setLayer(geoJson);
    setCoords(newCoords);
    setLayersProps(updatedLayersProps(geoJson, newCoords));
    const newBounds = BoundingBox.getBoundingBox(newCoords);
    console.log('newBounds: ', newBounds);
    setBounds(newBounds);
  }

  const updateFromTrack = (track: Track) => {
    console.log('Track: ', track);

    const newCoords = track.coords();
    const geoJson = updateGeoJsonTrackByCoords(layer as GeoJSONFeatureCollection, newCoords);
    console.log('geoJson: ', geoJson);

    updateFromGeoJson(geoJson, newCoords);
  }

  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
    console.log('Read file: ', file);

    toGeoJson(file, [
      setLayer,
      (layer) => {
        console.log('Layer: ', layer)
        const newCoords = getCoords(layer);
        console.log('newCoords: ', newCoords);
        setCoords(newCoords);
        setLayersProps(updatedLayersProps(layer, newCoords));

        const newBounds = BoundingBox.getBoundingBox(newCoords);
        console.log('newBounds: ', newBounds);
        setBounds(newBounds);
      }]); // save converted geojson to hook state
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

  const handleMergeTrackSegments = () => {
    console.log('handleMergeTrackSegments')
    if (layer as GeoJSONFeatureCollection) {
      const geoJson = mergeTackSegments(layer as GeoJSONFeatureCollection);
      const newCoords = getCoords(geoJson);
      updateFromGeoJson(geoJson, newCoords as TrackPoint[]);
    }
  }

  const handleSplitCruft = () => {
    console.log('handleSplitCruft')
    if (layer as GeoJSONFeatureCollection) {
      const geoJsonLayers = splitTrackSegmentByCruft(layer as GeoJSONFeatureCollection);
      console.log('geoJson: ', geoJsonLayers)
      // TODO: Add ability for multiple GeoJson layers, programmatic styling

      // setLayer(geoJson);
      // const newCoords = getCoords(geoJson);
      // setCoords(newCoords);
      // setLayersProps(updatedLayersProps(geoJson, newCoords));
    }
  }

  const handleClipCruft = () => {
    console.log('handleClipCruft')
    if (layer as GeoJSONFeatureCollection) {
      const geoJson = clipTrackSegmentByCruft(layer as GeoJSONFeatureCollection);
      const newCoords = getCoords(geoJson);
      updateFromGeoJson(geoJson, newCoords as TrackPoint[]);
    }
  }

  const handleSmoothStationary = () => {
    console.log('handleSmoothStationary')
    if (layer as GeoJSONFeatureCollection) {
      const track = new Track(coords as TrackPoint[]);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      let numberNodesRemoved = track.smoothStationary(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothBySpeed = () => {
    console.log('handleSmoothBySpeed')
    if (layer as GeoJSONFeatureCollection) {
      const track = new Track(coords as TrackPoint[]);
      track.addProperties();
      const speedLimitKph = Conversion.Speed.mphToKph(4);
      const speedLimitMpS = Conversion.Speed.kphToMetersPerSecond(speedLimitKph);

      let numberNodesRemoved = track.smoothBySpeed(speedLimitMpS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothByAngularSpeed = () => {
    console.log('handleSmoothByAngularSpeed')
    if (layer as GeoJSONFeatureCollection) {
      const track = new Track(coords as TrackPoint[]);
      track.addProperties();

      //1.0472; // 60 deg/sec = 3 seconds to walk around a switchback
      const angularSpeedLimitRadS = 1.0472;

      let numberNodesRemoved = track.smoothByAngularSpeed(angularSpeedLimitRadS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleSmoothNoiseCloud = () => {
    console.log('handleSmoothNoiseCloud')
    if (layer as GeoJSONFeatureCollection) {
      const track = new Track(coords as TrackPoint[]);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      let numberNodesRemoved = track.smoothNoiseClouds(minSpeedMS, true);
      console.log('numberNodesRemoved: ', numberNodesRemoved);

      updateFromTrack(track);
    }
  }

  const handleGetElevation = () => {
    console.log('handleGetElevation')
    // if (layer as GeoJSONFeatureCollection) {
    // const track = new Track(coords as Coordinate[]);
    // track.addElevations();

    // updateFromTrack(track);
    // }s
  }

  const handleSmoothByElevation = () => {
    console.log('handleSmoothByElevation')
    // if (layer as GeoJSONFeatureCollection) {
    //   const track = new Track(coords as Coordinate[]);
    //   track.addProperties();

    // //0.254 meters/second = 3000 ft / hr
    // const elevationSpeedLimitMPS = 0.254;

    // let numberNodesRemoved = track.smoothByElevationSpeed(elevationSpeedLimitMPS, true);
    // console.log('numberNodesRemoved: ', numberNodesRemoved);

    // updateFromTrack(track);maxDescentRateMPS
    // }
  }

  const updatedLayersProps = (layer: GeoJSONFeatureCollection, coords): LayersControlProps =>
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
      <input type="button" onClick={handleMergeTrackSegments} value="Merge Track Segments" />

      <input type="button" onClick={handleSplitCruft} value="Split Cruft" />
      <input type="button" onClick={handleClipCruft} value="Clip Cruft" />

      <input type="button" onClick={handleSmoothStationary} value="Smooth Stationary" />
      <input type="button" onClick={handleSmoothNoiseCloud} value="Smooth Noise Cloud" />

      <input type="button" onClick={handleSmoothBySpeed} value="Smooth by Speed" />
      <input type="button" onClick={handleSmoothByAngularSpeed} value="Smooth by Angular Speed" />

      <input type="button" onClick={handleGetElevation} value="Get Elevation Data" />
      <input type="button" onClick={handleSmoothByElevation} value="Smooth by Elevation Rate" />

      <input type="button" onClick={handleGPXSaveFile} value="Save as GPX File" />
      <input type="button" onClick={handleKMLSaveFile} value="Save as KML File" />
    </div>
  )
}
