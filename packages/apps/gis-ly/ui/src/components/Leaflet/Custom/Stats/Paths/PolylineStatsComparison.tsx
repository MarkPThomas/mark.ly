import { ITrackStats } from "../../../../../../../../libraries/gis/src/Core/Track/Stats";
import { IPolylineSize } from "../../../../../model/Geometry";

import './PolylineStatsComparison.css';

export interface IEditedPolylineStats extends ITrackStats {
  size: IPolylineSize
}

export type PolylineStatsProps = {
  statsInitial: IEditedPolylineStats,
  statsCurrent: IEditedPolylineStats
};

export function PolylineStatsComparison({ statsInitial, statsCurrent }: PolylineStatsProps) {
  return (
    <>
      <table className="track-comparison">
        <thead>
          <tr>
            <th align="center">Track</th>
            <th align="center">Points</th>
            <th align="center">Segments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="left">Initial</td>
            <td align="right">{statsInitial.size.vertices}</td>
            <td align="right">{statsInitial.size.segments}</td>
          </tr>
          {
            statsCurrent ?
              <tr>
                <td align="left">Current</td>
                <td align="right">{statsCurrent.size.vertices}</td>
                <td align="right">{statsCurrent.size.segments}</td>
              </tr>
              : null
          }
        </tbody>
      </table>
    </>
  )
}