import { useMapEvent } from 'react-leaflet';

type Props = { animateRef: React.MutableRefObject<boolean> };

export function SetViewOnClick({ animateRef }: Props) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  })

  return null
}