import {
  LayerGroup
} from 'react-leaflet';

import { hashString } from '../../../../../../../../common/utils';

import { TrackPoint } from '../../../../../model/GIS/Core/Track/TrackPoint';

import { CoordinateMarker } from './CoordinateMarker';

export type CoordinateMarkersLayerProps = {
  coords: TrackPoint[]
}

export function CoordinateMarkersLayer({ coords }: CoordinateMarkersLayerProps) {
  return (
    (coords as TrackPoint[])
      ?
      <LayerGroup key={hashString(JSON.stringify(coords))}>
        {coords.map((coord: TrackPoint) =>
          <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />
        )}
      </LayerGroup>
      : null
  )
}