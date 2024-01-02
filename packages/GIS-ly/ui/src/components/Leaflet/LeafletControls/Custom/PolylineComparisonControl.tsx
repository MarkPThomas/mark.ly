import { POSITION_CLASSES } from "../controlSettings";

export type PolylineComparisonControlProps = {
  position?: POSITION_CLASSES,
}

export function PolylineComparisonControl({ position }: PolylineComparisonControlProps) {
  const positionClass = position || POSITION_CLASSES.bottomleft;
  return (
    <div className='leaflet-top leaflet-center'>
      <div className="leaflet-control leaflet-bar">Polyline Comparison Stats</div>
    </div>
  )
}