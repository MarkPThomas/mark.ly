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
  coord
}

export function CoordinateMarker({ coord }: CoordinateMarkerProps) {
  return <Circle
    key={hashString(JSON.stringify(coord))}
    center={[coord.latitude, coord.longitude]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={10}
  >
    <Popup>
      <span>
        <div><b>Latitude:</b> {coord.latitude}</div>
        <div><b>Longitude:</b> {coord.longitude}</div>
        {coord.elevationMeters &&
          <div><b>Elevation:</b> {coord.elevationMeters} m / {metersToFeetRound(coord.elevationMeters)} ft</div>}
        {coord.timeStamp &&
          <div><b>Timestamp:</b> {coord.timeStamp}</div>}
      </span>
    </Popup>
  </Circle>
}