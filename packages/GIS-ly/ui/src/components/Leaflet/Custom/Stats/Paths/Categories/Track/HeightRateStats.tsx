import { useState } from "react";

import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { IHeightRate } from "../../../../../../../model/GIS/Core/Track/Stats/HeightRateStats";
import { RangeStats } from '../../RangeStats';


export type HeightRateStatsProps = { heightRate: IHeightRate };

export function HeightRateStats({ heightRate }: HeightRateStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

  const heightRateFormat = (valMetersPerSecond: number) => {
    return valMetersPerSecond ? `${Conversion.Speed.metersPerSecondToFeetPerHour(valMetersPerSecond).toFixed(0)} ft/hr` : '';
  }

  return (
    <div onClick={handleClick}>
      <div>
        <h5>Ascent</h5>
        <RangeStats {...heightRate.ascent} showAll={showAll} formatter={heightRateFormat} />
      </div>
      <div>
        <h5>Descent</h5>
        <RangeStats {...heightRate.descent} showAll={showAll} formatter={heightRateFormat} />
      </div>
    </div>
  )
}