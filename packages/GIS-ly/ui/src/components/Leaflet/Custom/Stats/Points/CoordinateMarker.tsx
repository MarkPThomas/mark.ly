import React from 'react';
import {
  Popup,
  Circle
} from 'react-leaflet';

import { hashString } from '../../../../../../../../common/utils'; //'common/utils';
import { Conversion } from '../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { Angle } from '../../../../../../../../common/utils/math/Coordinates/Angle';

import { TrackPoint } from '../../../../../model/GIS/Core/Track/TrackPoint';

import { LabelValue } from '../../LabelValueList';


export type CoordinateMarkerProps = {
  coord: TrackPoint
}

export function CoordinateMarker({ coord }: CoordinateMarkerProps) {
  const elevationMeasuredMetersFeet = coord.alt ? `${coord.alt} m / ${Math.round(Conversion.Length.Meters.toFeet(coord.alt))} ft` : '';
  const elevationMappedMetersFeet = coord.elevation ? `${coord.elevation} m / ${Math.round(Conversion.Length.Meters.toFeet(coord.elevation))} ft` : '';
  const elevationRateFeetPerHour = coord.path?.ascentRate ? `${Conversion.Length.Meters.toFeet(coord.path.ascentRate).toFixed(1)} ft/hr` : '';
  const speedMPH = coord.path.speed ? `${Conversion.Speed.kphToMph(Conversion.Speed.metersPerSecondToKph(coord.path.speed)).toFixed(1)} mph` : '';
  const rotationDeg = coord.path?.rotation ? `${Math.abs(Angle.RadiansToDegrees(coord.path.rotation)).toFixed(2)} deg ${coord.path.rotation > 0 ? 'CCW' : 'CW'}` : '';
  const angularSpeedDegPerSec = coord.path?.rotationRate ? `${Angle.RadiansToDegrees(coord.path.rotationRate).toFixed(5)} deg/sec` : '';

  return <Circle
    key={hashString(JSON.stringify(coord))}
    center={[coord.lat, coord.lng]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={30}
  >
    <Popup>
      <span>
        {coord.timestamp ?
          <LabelValue label={'Timestamp'} value={coord.timestamp} /> : null}
        <LabelValue label={'Latitude'} value={coord.lat} />
        <LabelValue label={'Longitude'} value={coord.lng} />
        {coord.elevation ?
          <LabelValue label={'Elevation (DEM)'} value={elevationMappedMetersFeet} /> : null}
        {coord.alt ?
          <LabelValue label={'Elevation (GPS)'} value={elevationMeasuredMetersFeet} /> : null}
        {(coord.path && coord.path.ascentRate) ?
          <LabelValue label={'Elevation Rate'} value={elevationRateFeetPerHour} /> : null}
        {coord.path.speed ?
          <LabelValue label={'Speed (average)'} value={speedMPH} /> : null}
        {(coord.path && coord.path.rotation) ?
          <LabelValue label={'Rotation'} value={rotationDeg} /> : null}
        {(coord.path && coord.path.rotationRate) ?
          <LabelValue label={'Angular Speed'} value={angularSpeedDegPerSec} /> : null}
      </span>
    </Popup>
  </Circle>
}