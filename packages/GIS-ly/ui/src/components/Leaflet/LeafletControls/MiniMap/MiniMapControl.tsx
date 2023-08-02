import React, { useMemo } from 'react';
import { useMap, MapContainer, TileLayer } from 'react-leaflet';

import { MiniMapBounds } from './MiniMapBounds'

// Note: from https://react-leaflet.js.org/docs/example-react-control/

// TODO: Extract this to another file? Or revert this to an object and type the limited values?
export enum POSITION_CLASSES {
  bottomleft = 'leaflet-bottom leaflet-left',
  bottomright = 'leaflet-bottom leaflet-right',
  topleft = 'leaflet-top leaflet-left',
  topright = 'leaflet-top leaflet-right',
}

type Props = {
  position?: POSITION_CLASSES,
  zoom?: number
}

export function MiniMapControl({ position, zoom }: Props) {
  const parentMap = useMap();
  const mapZoom = zoom || 0;

  // TODO: Adjust this to update for zoom changes
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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MiniMapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [],
  )

  const positionClass = position || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}
