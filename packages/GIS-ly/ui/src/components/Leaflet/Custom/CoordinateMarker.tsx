import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer, TileLayerProps,
  LayerGroup,
  Marker, Popup,
  Circle,
  GeoJSON,
  useMap,
} from 'react-leaflet';

import { getBoundingBox, getCoords, Coordinate } from '../../../model/Leaflet';
import { metersToFeetRound } from '../../../model/Leaflet/Conversion';

import { hashString } from '../../../../../../common/utils'; //'common/utils';

export type CoordinateMarkerProps = {
  coord: Coordinate
}

export function CoordinateMarker({ coord }: CoordinateMarkerProps) {
  return <Circle
    key={hashString(JSON.stringify(coord))}
    center={[coord.lat, coord.lng]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={10}
  >
    <Popup>
      <span>
        <div><b>Latitude:</b> {coord.lat}</div>
        <div><b>Longitude:</b> {coord.lng}</div>
        {coord.alt &&
          <div><b>Elevation:</b> {coord.alt} m / {metersToFeetRound(coord.alt)} ft</div>}
        {coord.timeStamp &&
          <div><b>Timestamp:</b> {coord.timeStamp}</div>}
      </span>
    </Popup>
  </Circle>
}