import { useState } from "react";

import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { RangeStats } from '../../RangeStats';
import { IRangeStatsResults } from "../../../../../../../model/Geometry/Stats";
import { TrackPoint, TrackSegment } from "../../../../../../../model/GIS/Core/Track";


export type SpeedStatsProps = { speed: IRangeStatsResults<TrackPoint, TrackSegment> };

export function SpeedStats({ speed }: SpeedStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

  const speedFormat = (valMetersPerSecond: number) => {
    return valMetersPerSecond ? `${Conversion.Speed.metersPerSecondToMph(valMetersPerSecond).toFixed(1)} mph` : '';
  }

  return (
    <div onClick={handleClick}>
      <RangeStats {...speed} showAll={showAll} formatter={speedFormat} />
    </div>
  )
}