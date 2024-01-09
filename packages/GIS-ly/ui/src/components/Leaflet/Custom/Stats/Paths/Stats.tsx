import styled from "styled-components";

import { IPolylineSize } from "../../../../../model/Geometry";
import { ITrackStats } from "../../../../../model/GIS/Core/Track/Stats";
import { ToggleGroup } from "../../ToggleGroup";
import { RouteStats } from "./RouteStats";
import { TrackStats } from "./TrackStats";

const FlowControl = styled.div`
  //max-width: 25rem;
  max-height: 30rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export interface IEditedStats extends ITrackStats {
  size: IPolylineSize
}

export type StatsProps = { stats: IEditedStats };

export function Stats({ stats }: StatsProps) {
  console.log('Stats: ', stats);

  const level = 2;

  return (
    <div>
      <h2 className="stats">Stats</h2>
      <hr />
      <FlowControl>
        <ToggleGroup
          value={'Route'}
          level={level}
          children={[<RouteStats key={Date()} stats={stats} level={level + 1} />]}
        />
        <hr />
        <ToggleGroup
          value={'Track'}
          level={level}
          children={[<TrackStats key={Date()} stats={stats} level={level + 1} />]}
        />
      </FlowControl>
    </div>
  )
}