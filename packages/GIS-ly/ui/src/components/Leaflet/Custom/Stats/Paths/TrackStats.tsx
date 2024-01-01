import { ToggleGroup } from "../../ToggleGroup";
import { HeightRateStats, SpeedStats, TimeStats } from './Categories/Track';
import { IEditedStats } from "./Stats";

export type TrackStatsProp = { stats: IEditedStats };

export function TrackStats({ stats }: TrackStatsProp) {
  return (
    <div>
      {stats.height ?
        <ToggleGroup
          value={'Time'}
          level={4}
          children={[<TimeStats time={stats.time} />]}
        /> : null}
      {stats.height ?
        <ToggleGroup
          value={'Speed'}
          level={4}
          children={[<SpeedStats speed={stats.speed} />]}
        /> : null}
      {stats.height ?
        <ToggleGroup
          value={'Height Rate'}
          level={4}
          children={[<HeightRateStats heightRate={stats.heightRate} />]}
        /> : null}
    </div>
  );
}