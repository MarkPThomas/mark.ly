import { Conversion } from '../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { Angle } from '../../../../../../../../../common/utils/math/Coordinates/Angle';

import { ITrackPathProps } from '../../../../../../model/GIS/Core/Track';
import { LabelValueEntry } from '../../../LabelValueEntry';

import './PointPathStats.css';

export type PointPathStatsProps = { path: ITrackPathProps };

export function PointPathStats({ path }: PointPathStatsProps) {
  const ascentRateFeetPerHour = path?.ascentRate ? `${Conversion.Length.Meters.toFeet(path.ascentRate).toFixed(1)} ft/hr` : '';
  const descentRateFeetPerHour = path?.descentRate ? `${Conversion.Length.Meters.toFeet(path.descentRate).toFixed(1)} ft/hr` : '';
  const speedMph = path.speed ? `${Conversion.Speed.MetersPerSecond.toMph(path.speed).toFixed(1)} mph` : '';
  const rotationDeg = path?.rotation ? `${Math.abs(Angle.RadiansToDegrees(path.rotation)).toFixed(2)}° ${path.rotation > 0 ? 'CCW' : 'CW'}` : '';
  const angularSpeedDegPerSec = path?.rotationRate ? `${Angle.RadiansToDegrees(path.rotationRate).toFixed(5)}°/sec` : '';

  return (
    <div className="path-stats">
      <LabelValueEntry label={'Speed (avg)'} value={speedMph} />
      <LabelValueEntry label={'Ascent Rate (avg)'} value={ascentRateFeetPerHour} />
      <LabelValueEntry label={'Descent Rate (avg)'} value={descentRateFeetPerHour} />
      <LabelValueEntry label={'Rotation'} value={rotationDeg} />
      <LabelValueEntry label={'Angular Speed'} value={angularSpeedDegPerSec} />
    </div>
  );
}