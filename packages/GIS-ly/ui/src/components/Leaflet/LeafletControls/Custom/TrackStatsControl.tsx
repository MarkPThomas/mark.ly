import { IEditedStats, Stats } from "../../Custom/Stats/Paths/Stats";

export type TrackStatsControlProps = {
  stats: IEditedStats
}

export function TrackStatsControl({ stats }: TrackStatsControlProps) {
  return (
    <div className="leaflet-bar item stats-control">
      <Stats stats={stats} />
    </div>

  )
}