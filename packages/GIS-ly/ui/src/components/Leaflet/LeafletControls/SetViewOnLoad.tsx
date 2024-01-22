import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export type SetViewOnLoadProps = { bounds: LatLngBoundsExpression | LatLngExpression };

export function SetViewOnLoad({ bounds }: SetViewOnLoadProps) {
  if (bounds === null) {
    return null;
  }

  const map = useMap();

  useEffect(() => {
    if (bounds[0].length) {
      map.flyToBounds((bounds as LatLngBoundsExpression));
    } else {
      map.flyTo((bounds as LatLngExpression));
    }
  }, [bounds]);

  return null;
}