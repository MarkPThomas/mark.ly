import { ITrackStats } from "../../../../../model/GIS/Core/Track/Stats";
import { IPolylineSize } from "../../../../../model/Geometry";

export interface IEditedTrackStats extends ITrackStats {
  size: IPolylineSize
}

export type TrackStatsProps = { statsInitial: IEditedTrackStats, statsCurrent: IEditedTrackStats };

export function TrackStatsComparison({ statsInitial, statsCurrent }: TrackStatsProps) {
  return (
    <div>
      <div><h2>Track Size</h2></div>
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
    </div>
  )
}