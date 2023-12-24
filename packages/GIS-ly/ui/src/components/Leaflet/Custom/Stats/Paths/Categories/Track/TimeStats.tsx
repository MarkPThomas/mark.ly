import { useState } from "react";

import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { ITime } from "../../../../../../../model/GIS/Core/Track/Stats/TimeStats";
import { LabelValue } from "../../../../LabelValueList";
import { RangeStats } from '../../RangeStats';


export type TimeStatsProps = { time: ITime };

export function TimeStats({ time }: TimeStatsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleClick = () => {
    setShowAll(!showAll);
  }

  const timeDurationFormat = (timeSec: number) => {
    return timeSec ? `${Conversion.Time.Seconds.toHours(timeSec).toFixed(2)} hrs` : '';
  }

  const timeIntervalsFormat = (timeSec: number) => {
    return timeSec ? `${timeSec.toFixed(0)} sec` : '';
  }

  const durationHr = timeDurationFormat(time.duration);

  return (
    <div onClick={handleClick}>
      <LabelValue label={'Duration'} value={durationHr} />
      <RangeStats {...time} showAll={showAll} formatter={timeIntervalsFormat} />
    </div>
  )
}