import { ITrackStats } from "../../../../../model/GIS/Core/Track/Stats";
import { IPolylineSize } from "../../../../../model/Geometry";

export interface IEditedPolylineStats extends ITrackStats {
  size: IPolylineSize
}

export type PolylineStatsProps = {
  statsInitial: IEditedPolylineStats,
  statsCurrent: IEditedPolylineStats
};

export function PolylineStatsComparison({ statsInitial, statsCurrent }: PolylineStatsProps) {
  return (
    <table className="track-comparison">
      <thead>
        <tr>
          <th>Track</th>
          <th>Points</th>
          <th>Segments</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Initial</td>
          <td>{statsInitial.size.vertices}</td>
          <td>{statsInitial.size.segments}</td>
        </tr>
        {
          statsCurrent ?
            <tr>
              <td>Current</td>
              <td>{statsCurrent.size.vertices}</td>
              <td>{statsCurrent.size.segments}</td>
            </tr>
            : null
        }
      </tbody>
    </table>
  )
}