import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { useMap } from 'react-leaflet';

export type SetViewOnTrackLoadProps = { bounds: LatLngBoundsExpression | LatLngExpression };

export function SetViewOnTrackLoad({ bounds }: SetViewOnTrackLoadProps) {
  if (bounds === null) {
    return null;
  }
  const map = useMap();
  if (bounds[0].length) {
    map.flyToBounds((bounds as LatLngBoundsExpression));
  } else {
    map.flyTo((bounds as LatLngExpression));
  }

  return null;
}