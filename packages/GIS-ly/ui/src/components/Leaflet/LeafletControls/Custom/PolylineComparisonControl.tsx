import { IEditedPolylineStats, PolylineStatsComparison } from "../../Custom/Stats/Paths/PolylineStatsComparison";

export type PolylineComparisonControlProps = {
  statsInitial: IEditedPolylineStats,
  statsCurrent: IEditedPolylineStats
}

export function PolylineComparisonControl({ statsInitial, statsCurrent }: PolylineComparisonControlProps) {
  return (
    <div className="leaflet-bar top-center">
      <h2>Polyline Comparison Stats</h2>
      <PolylineStatsComparison statsInitial={statsInitial} statsCurrent={statsCurrent} />
    </div>

  )
}