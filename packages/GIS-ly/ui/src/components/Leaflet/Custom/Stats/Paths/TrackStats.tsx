import { ToggleGroup } from "../../ToggleGroup";
import { HeightRateStats, SpeedStats, TimeStats } from './Categories/Track';
import { IEditedStats } from "./Stats";

export type TrackStatsProp = { stats: IEditedStats, level: number };

export function TrackStats({ stats, level }: TrackStatsProp) {
  return (
    <div>
      {stats.height ?
        <ToggleGroup
          value={'Time'}
          level={level}
          children={[<TimeStats key={Date()} time={stats.time} level={level + 2} />]}
        /> : null}
      {stats.height ?
        <ToggleGroup
          value={'Speed'}
          level={level}
          children={[<SpeedStats key={Date()} speed={stats.speed} level={level + 2} />]}
        /> : null}
      {stats.height ?
        <ToggleGroup
          value={'Height Rate'}
          level={level}
          children={[<HeightRateStats key={Date()} heightRate={stats.heightRate} level={level + 2} />]}
        /> : null}
    </div>
  );
}