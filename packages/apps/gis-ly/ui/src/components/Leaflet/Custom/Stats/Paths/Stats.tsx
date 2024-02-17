import { IPolylineSize } from "@markpthomas/geometry/polyline";
import { ITrackStats } from "@markpthomas/gis/core/track/stats";

import { ToggleGroup } from "../../ToggleGroup";
import { RouteStats } from "./RouteStats";
import { TrackStats } from "./TrackStats";

import styles from './Stats.module.css';

export interface IEditedStats extends ITrackStats {
  size: IPolylineSize
}

export type StatsProps = { stats: IEditedStats };

export function Stats({ stats }: StatsProps) {
  console.log('Stats: ', stats);

  const level = 2;

  return (
    <div>
      <div className={styles.stats} key={Date() + '2'} >
        <ToggleGroup
          value={'Route'}
          level={level}
          children={[<RouteStats key={Date()} stats={stats} level={level + 1} className={styles.group} />]}
        />
        <hr />
        <ToggleGroup
          value={'Track'}
          level={level}
          children={[<TrackStats key={Date()} stats={stats} level={level + 1} className={styles.group} />]}
        />
      </div>
    </div>
  )
}