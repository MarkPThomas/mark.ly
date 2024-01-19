import { useMemo } from 'react';
import { useMap, MapContainer, TileLayer } from 'react-leaflet';

import { MiniMapBounds } from './MiniMapBounds'
import { POSITION_CLASSES } from '../controlSettings';

// Note: from https://react-leaflet.js.org/docs/example-react-control/

type Props = {
  position?: POSITION_CLASSES,
  zoom?: number,
  tileSourceUrl: string
}

export function MiniMapControl({ position, zoom, tileSourceUrl }: Props) {
  const parentMap = useMap();
  const mapZoom = zoom || 0;

  // TODO: Adjust this to update for zoom changes - needs to be done in Map.tsx by calling setPosition
  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}>
        <TileLayer url={tileSourceUrl} />
        <MiniMapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [mapZoom]
  )

  const positionClass = position || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}
