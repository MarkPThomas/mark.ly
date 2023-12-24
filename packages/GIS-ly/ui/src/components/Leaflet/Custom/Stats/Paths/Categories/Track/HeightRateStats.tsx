import { useState } from "react";

import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { IHeightRate } from "../../../../../../../model/GIS/Core/Track/Stats/HeightRateStats";
import { LabelValue } from "../../../../LabelValueList";
import { RangeStatsProps, RangeStats } from '../../RangeStats';


export type HeightRateStatsProps = { heightRate: IHeightRate };

export function HeightRateStats({ heightRate }: HeightRateStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

  const heightRateFormat = (valMetersPerSecond: number) => {
    return valMetersPerSecond ? `${Conversion.Speed.metersPerSecondToFeetPerHour(valMetersPerSecond).toFixed(0)} ft/hr` : '';
  }

  // const ascentAvgFtPrHr = heightRateFormat(heightRate.ascent.avg);
  // const ascentMaxFtPrHr = heightRateFormat(heightRate.ascent.max.value);
  // const descentAvgFtPrHr = heightRateFormat(heightRate.descent.avg);
  // const descentMaxFtPrHr = heightRateFormat(heightRate.descent.max.value);

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
      {/* <LabelValue label={'Ascent Avg'} value={ascentAvgFtPrHr} />
      <LabelValue label={'Ascent Max'} value={ascentMaxFtPrHr} />
      <LabelValue label={'Descent Avg'} value={descentAvgFtPrHr} />
      <LabelValue label={'Descent Max'} value={descentMaxFtPrHr} />
      <RangeStats {...heightRangeProps} showAll={showAll} formatter={slopeFormat} /> */}
    </div>
  )
}