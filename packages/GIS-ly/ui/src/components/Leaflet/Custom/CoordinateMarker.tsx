import React from 'react';
import {
  Popup,
  Circle
} from 'react-leaflet';

import { hashString } from '../../../../../../common/utils'; //'common/utils';
import { Conversion } from '../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { Angle } from '../../../../../../common/utils/math/Coordinates/Angle';

import { Coordinate } from '../../../model/GIS/Coordinate';
import { LabelValue } from './LabelValueList';


export type CoordinateMarkerProps = {
  coord: Coordinate
}

export function CoordinateMarker({ coord }: CoordinateMarkerProps) {
  const elevationMeasuredMetersFeet = coord.alt ? `${coord.alt} m / ${Math.round(Conversion.Length.Meters.toFeet(coord.alt))} ft` : '';
  const elevationMappedMetersFeet = coord.altExt ? `${coord.altExt} m / ${Math.round(Conversion.Length.Meters.toFeet(coord.altExt))} ft` : '';
  const elevationRateFeetPerHour = coord.path?.elevationRate ? `${Conversion.Length.Meters.toFeet(coord.path.elevationRate).toFixed(1)} ft/hr` : '';
  const speedMPH = coord.speedAvg ? `${Conversion.Speed.kphToMph(Conversion.Speed.metersPerSecondToKph(coord.speedAvg)).toFixed(1)} mph` : '';
  const rotationDeg = coord.path?.rotation ? `${Math.abs(Angle.RadiansToDegrees(coord.path.rotation)).toFixed(2)} deg ${coord.path.rotation > 0 ? 'CCW' : 'CW'}` : '';
  const angularSpeedDegPerSec = coord.path?.angularSpeed ? `${Angle.RadiansToDegrees(coord.path.angularSpeed).toFixed(5)} deg/sec` : '';

  return <Circle
    key={hashString(JSON.stringify(coord))}
    center={[coord.lat, coord.lng]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={5}
  >
    <Popup>
      <span>
        {coord.timeStamp &&
          <LabelValue label={'Timestamp'} value={coord.timeStamp} />}
        <LabelValue label={'Latitude'} value={coord.lat} />
        <LabelValue label={'Longitude'} value={coord.lng} />
        {coord.altExt &&
          <LabelValue label={'Elevation (DEM)'} value={elevationMappedMetersFeet} />}
        {coord.alt &&
          <LabelValue label={'Elevation (GPS)'} value={elevationMeasuredMetersFeet} />}
        {coord.path && coord.path.elevationRate &&
          <LabelValue label={'Elevation Rate'} value={elevationRateFeetPerHour} />}
        {coord.speedAvg &&
          <LabelValue label={'Speed (average)'} value={speedMPH} />}
        {coord.path && coord.path.rotation &&
          <LabelValue label={'Rotation'} value={rotationDeg} />}
        {coord.path && coord.path.angularSpeed &&
          <LabelValue label={'Angular Speed'} value={angularSpeedDegPerSec} />}
      </span>
    </Popup>
  </Circle>
}