import React, { useEffect, useState, useRef } from 'react';
import { LatLngTuple } from 'leaflet';
import {
  MapContainer,
  GeoJSON,
} from 'react-leaflet';

import { toGeoJson } from '../../model/Files';
import { getBoundingBox, getCoords, Coordinate, metersToFeet } from '../../model/Leaflet';

import { MiniMapControl, POSITION_CLASSES } from './LeafletControls/MiniMap/MiniMapControl';
import { LayersControl, LayersControlProps } from './LeafletControls/Layers/LayersControl';
import { SetViewOnClick } from './LeafletControls/SetViewOnClick';
import { SetViewOnTrackLoad } from './LeafletControls/SetViewOnTrackLoad';
import { CoordinateMarkersLayer } from './Custom/CoordinateMarkersLayer';

import { hashString } from '../../../../../common/utils'; //'common/utils';

export type MapProps = {
  initialPosition: {
    point: LatLngTuple,
    zoom: number
  },
  initialLayers?: LayersControlProps
};


export const Map = ({ initialPosition, initialLayers }: MapProps) => {
  const [layer, setLayer] = useState(null);
  const [coords, setCoords] = useState(null);
  const [bounds, setBounds] = useState(null);
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

        const newBounds = getBoundingBox(newCoords);
        console.log('newBounds: ', newBounds);
        setBounds(newBounds);
      }]); // save converted geojson to hook state
  };

  const animateRef = useRef(true);
  const handleSetViewOnClick = () => {
    console.log('Toggled!');
    animateRef.current = !animateRef.current;
  }

  const layersProps = layer ? {
    ...initialLayers,
    overlays: [{
      name: 'Track',
      geoJSON: layer,
      items: [
        coords
      ]
    }]
  } : { ...initialLayers };

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
          (layersProps.baseLayers.length > 1 || layersProps.overlays.length)
            ?
            <LayersControl {...layersProps} />
            : null
        }
        {/* {coords ?
          <CoordinateMarkersLayer coords={coords} /> : null
        }
        {layer ?
          <GeoJSON key={hashString(JSON.stringify(layer))} data={layer} /> : null
        } */}
        <SetViewOnClick animateRef={animateRef} />
        <SetViewOnTrackLoad bounds={bounds} />
      </MapContainer>
      <input type="file" onChange={handleFileSelection} />
      <input type="checkbox" onClick={handleSetViewOnClick} id="animatePan" value="animatePan" defaultChecked />
      <label htmlFor="animatePan">Set View On Click</label>
    </div>
    // :
    // <>'Data is loading...'</>
  )
}
