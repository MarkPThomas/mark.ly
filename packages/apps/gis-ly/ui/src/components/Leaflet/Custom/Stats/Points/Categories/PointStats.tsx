import { Conversion } from '@markpthomas/units/conversion';
import { ITrackPoint } from "@markpthomas/gis/core/track";

import { LabelValue } from '../../../LabelValue';

export type PointStatsProps = { point: ITrackPoint };

export function PointStats({ point }: PointStatsProps) {
  const latitude = `${point.lat.toFixed(6)}°`;
  const longitude = `${point.lng.toFixed(6)}°`;

  const elevationMeasuredMetersFeet = point.alt ?
    `${Math.round(point.alt)} m / ${Math.round(Conversion.Length.Meters.toFeet(point.alt))} ft (GPS)` : '';
  const elevationMappedMetersFeet = point.elevation ?
    `${Math.round(point.elevation)} m / ${Math.round(Conversion.Length.Meters.toFeet(point.elevation))} ft (DEM)` : '';
  const elevationMetersFeet = (elevationMeasuredMetersFeet && elevationMappedMetersFeet)
    ? `${elevationMeasuredMetersFeet} | ${elevationMappedMetersFeet}`
    : elevationMeasuredMetersFeet
      ? elevationMeasuredMetersFeet
      : elevationMappedMetersFeet;

  return (
    <div>
      <LabelValue label={'Latitude'} value={latitude} />
      <LabelValue label={'Longitude'} value={longitude} />
      <LabelValue label={'Elevation'} value={elevationMetersFeet} />
    </div>
  );
}