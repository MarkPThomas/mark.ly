import { useMapEvent } from 'react-leaflet';

type Props = { animateRef: React.MutableRefObject<boolean> | boolean; };

export function SetViewOnClick({ animateRef }: Props) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: (typeof animateRef === "boolean" ? animateRef : animateRef.current) || false,
    });
  })

  return null
}