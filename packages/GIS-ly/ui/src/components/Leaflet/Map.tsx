import React, { useEffect, useState, useRef } from 'react';
import { LatLng, LatLngBoundsExpression, LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { FeatureCollection, GeoJSON, Geometry } from 'geojson';

import {
  toGeoJson, toGpxFile, toKmlFile
} from '../../model/Files';
import {
  Coordinate,
  Coordinates,
  GeoJSONFeatureCollection,
  clipTrackSegmentByCruft,
  getBoundingBox,
  getCoords,
  mergeTackSegments,
  splitTrackSegmentByCruft
} from '../../model/Leaflet';

import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';


export type MapProps = {
  initialPosition: {
    point: LatLngTuple,
    zoom: number
  },
  initialLayers?: LayersControlProps
};

export const Map = ({ initialPosition, initialLayers }: MapProps) => {
  const [layer, setLayer] = useState<GeoJSON>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [layersProps, setLayersProps] = useState(initialLayers)
  const [bounds, setBounds] = useState<LatLngBoundsExpression | LatLngExpression | null>(null);
  const [position, setPosition] = useState(initialPosition);

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

        const newBounds = getBoundingBox(newCoords);
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
      console.log('geoJson: ', geoJson)
      setLayer(geoJson);
      const newCoords = getCoords(geoJson);
      setCoords(newCoords);
      setLayersProps(updatedLayersProps(geoJson, newCoords));
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
      console.log('geoJson: ', geoJson)
      setLayer(geoJson);
      const newCoords = getCoords(geoJson);
      setCoords(newCoords);
      setLayersProps(updatedLayersProps(geoJson, newCoords));
    }
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
    // props.incidents ?
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
      <input type="button" onClick={handleGPXSaveFile} value="Save as GPX File" />
      <input type="button" onClick={handleKMLSaveFile} value="Save as KML File" />
    </div>
    // :
    // <>'Data is loading...'</>
  )
}
