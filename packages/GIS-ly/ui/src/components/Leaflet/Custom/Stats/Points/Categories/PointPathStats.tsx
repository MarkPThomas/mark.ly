import { Conversion } from '../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { Angle } from '../../../../../../../../../common/utils/math/Coordinates/Angle';

import { ITrackPathProps } from '../../../../../../model/GIS/Core/Track';
import { LabelValue } from '../../../LabelValueList';

export type PointPathStatsProps = { path: ITrackPathProps };

export function PointPathStats({ path }: PointPathStatsProps) {
  const ascentRateFeetPerHour = path?.ascentRate ? `${Conversion.Length.Meters.toFeet(path.ascentRate).toFixed(1)} ft/hr` : '';
  const descentRateFeetPerHour = path?.descentRate ? `${Conversion.Length.Meters.toFeet(path.descentRate).toFixed(1)} ft/hr` : '';
  const speedMph = path.speed ? `${Conversion.Speed.metersPerSecondToMph(path.speed).toFixed(1)} mph` : '';
  const rotationDeg = path?.rotation ? `${Math.abs(Angle.RadiansToDegrees(path.rotation)).toFixed(2)}° ${path.rotation > 0 ? 'CCW' : 'CW'}` : '';
  const angularSpeedDegPerSec = path?.rotationRate ? `${Angle.RadiansToDegrees(path.rotationRate).toFixed(5)}°/sec` : '';

  return (
    <div className="path-stats">
      {speedMph ?
        <LabelValue label={'Speed (avg)'} value={speedMph} /> : null}
      {ascentRateFeetPerHour ?
        <LabelValue label={'Ascent Rate (avg)'} value={ascentRateFeetPerHour} /> : null}
      {descentRateFeetPerHour ?
        <LabelValue label={'Descent Rate (avg)'} value={descentRateFeetPerHour} /> : null}
      {rotationDeg ?
        <LabelValue label={'Rotation'} value={rotationDeg} /> : null}
      {angularSpeedDegPerSec ?
        <LabelValue label={'Angular Speed'} value={angularSpeedDegPerSec} /> : null}
    </div>
  );
}