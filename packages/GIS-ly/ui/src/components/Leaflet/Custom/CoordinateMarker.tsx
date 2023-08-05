import React from 'react';
import {
  Popup,
  Circle
} from 'react-leaflet';

import { hashString } from '../../../../../../common/utils'; //'common/utils';
import { Conversion } from '../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { Coordinate } from '../../../model/GIS/Coordinate';


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
          <div><b>Elevation:</b> {coord.alt} m / {Math.round(Conversion.Length.Meters.toFeet(coord.alt))} ft</div>}
        {coord.timeStamp &&
          <div><b>Timestamp:</b> {coord.timeStamp}</div>}
      </span>
    </Popup>
  </Circle>
}