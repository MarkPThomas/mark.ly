import { useState } from "react";

import { ISlope } from "../../../../../../../model/GIS/Core/Route/Stats/SlopeStats";
import { RangeStats } from '../../RangeStats';
import { LabelValue } from "../../../../LabelValueList";


export type SlopeStatsProps = { slope: ISlope };

export function SlopeStats({ slope }: SlopeStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

  const toDegrees = (slopeRatio: number) => {
    return ((180 / Math.PI) * Math.atan(slopeRatio)).toFixed(0);
  }

  const toPercent = (slopeRatio: number) => {
    return (100 * slopeRatio).toFixed(0);
  }

  const slopeFormat = (slopeRatio: number) => {
    return slopeRatio ? `${toPercent(slopeRatio)} % / ${toDegrees(slopeRatio)} deg` : '';
  }

  const averageSlope = slopeFormat(slope.avg);

  return (
    <div onClick={handleClick}>
      <LabelValue label={'Avg'} value={averageSlope} />
      <div>
        <h5>Uphill</h5>
        <RangeStats {...slope.uphill} showAll={showAll} formatter={slopeFormat} />
      </div>
      <div>
        <h5>Downhill</h5>
        <RangeStats {...slope.downhill} showAll={showAll} formatter={slopeFormat} />
      </div>
    </div>
  )
}