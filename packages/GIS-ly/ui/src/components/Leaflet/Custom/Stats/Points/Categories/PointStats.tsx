import { Conversion } from '../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { ITrackPoint } from "../../../../../../model/GIS/Core/Track";
import { LabelValueEntry } from '../../../LabelValueEntry';

export type PointStatsProps = { point: ITrackPoint };

export function PointStats({ point }: PointStatsProps) {
  // Props
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
      <LabelValueEntry label={'Latitude'} value={latitude} />
      <LabelValueEntry label={'Longitude'} value={longitude} />
      <LabelValueEntry label={'Elevation'} value={elevationMetersFeet} />
    </div>
  );
}