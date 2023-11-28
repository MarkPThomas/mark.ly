import { ITrackStats } from "../../../model/GIS/Core/Track/Stats";
import { IPolylineSize } from "../../../model/Geometry";

export interface IEditedTrackStats extends ITrackStats {
  size: IPolylineSize
}

export type TrackStatsProps = { stats: IEditedTrackStats };

export function TrackStats({ stats }: TrackStatsProps) {
  return (
    <div>
      <div><b>Number Of Points:</b> {stats.size.vertices}</div>
      <div><b>Number Of Segments:</b> {stats.size.segments}</div>
      <div><b>Length:</b> {stats.length}</div>
    </div>
  )
}