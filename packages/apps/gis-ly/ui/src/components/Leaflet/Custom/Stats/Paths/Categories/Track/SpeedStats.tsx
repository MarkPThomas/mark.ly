import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { RangeStats } from '../../RangeStats';
import { IRangeStatsResults } from "../../../../../../../model/Geometry/Stats";
import { TrackPoint, TrackSegment } from "../../../../../../../../../../libraries/gis/src/Core/Track";


export type SpeedStatsProps = { speed: IRangeStatsResults<TrackPoint, TrackSegment>, level: number };

export function SpeedStats({ speed, level }: SpeedStatsProps) {

  const speedFormat = (valMetersPerSecond: number) => {
    return valMetersPerSecond ? `${Conversion.Speed.MetersPerSecond.toMph(valMetersPerSecond).toFixed(1)} mph` : '';
  }

  return (
    <div>
      <RangeStats {...speed} formatter={speedFormat} level={level} />
    </div>
  )
}