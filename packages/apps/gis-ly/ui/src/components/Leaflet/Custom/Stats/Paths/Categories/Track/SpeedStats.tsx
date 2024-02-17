import { Conversion } from '@markpthomas/units/conversion';
import { IRangeStatsResults } from "@markpthomas/geometry/stats";
import { TrackPoint, TrackSegment } from "@markpthomas/gis/core/track";

import { RangeStats } from '../../RangeStats';


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