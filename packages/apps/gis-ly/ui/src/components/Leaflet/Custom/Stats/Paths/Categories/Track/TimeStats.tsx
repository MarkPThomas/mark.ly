import { Conversion } from '@markpthomas/units/conversion';
import { ITime } from "@markpthomas/gis/track/stats";

import { LabelValue } from "../../../../LabelValue";
import { RangeStats } from '../../RangeStats';


export type TimeStatsProps = { time: ITime, level: number };

export function TimeStats({ time, level }: TimeStatsProps) {

  const timeHourFormat = (seconds: number) => {
    return seconds ? `${Conversion.Time.Seconds.toHours(seconds).toFixed(2)} hrs` : '';
  }

  const timeSecondsFormat = (seconds: number) => {
    return seconds ? `${seconds.toFixed(0)} sec` : '';
  }

  const timeDHHMMSSFormat = (seconds: number) => {
    const days = Math.floor(Conversion.Time.Seconds.toDays(seconds));
    const hhmmss = new Date(seconds * 1000).toISOString().slice(11, 19);

    return days ? `${days}:${hhmmss}` : hhmmss;
  }

  const timeIntervalFormat = (seconds: number) => {
    const intervalSec = timeSecondsFormat(seconds);

    return seconds < 60 ? intervalSec : `${intervalSec} / ${timeDHHMMSSFormat(seconds)}`;
  }

  const timeDurationFormat = (seconds: number) => `${timeHourFormat(seconds)} / ${timeDHHMMSSFormat(seconds)}`;

  const durationHr = timeDurationFormat(time.duration);

  return (
    <div>
      <LabelValue label={'Duration'} value={durationHr} />
      <RangeStats {...time} formatter={timeIntervalFormat} level={level} />
    </div>
  )
}