import { LatLngExpression, LatLngBoundsExpression, LatLng, LatLngTuple } from 'leaflet';
import { useMap, useMapEvent } from 'react-leaflet';

type Props = { bounds: any };

export function SetViewOnTrackLoad({ bounds }: Props) {
  if (bounds === null) {
    return null;
  }
  const map = useMap();
  if (bounds[0].length) {
    map.flyToBounds((bounds as LatLngBoundsExpression));
  } else {
    map.flyTo((bounds as LatLngExpression));
  }

  // const map = useMapEvent('click', (e) => {
  //   map.setView(e.latlng, map.getZoom(), {
  //     animate: animateRef.current || false,
  //   });
  // })

  return null
}