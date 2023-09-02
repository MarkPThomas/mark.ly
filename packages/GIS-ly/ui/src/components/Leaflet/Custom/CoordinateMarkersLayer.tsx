import React from 'react';
import {
  LayerGroup
} from 'react-leaflet';

import { hashString } from '../../../../../../common/utils';

import { TrackPoint } from '../../../model/GIS/TrackPoint';

import { CoordinateMarker } from './CoordinateMarker';

export type CoordinateMarkersLayerProps = {
  coords
}

export function CoordinateMarkersLayer({ coords }: CoordinateMarkersLayerProps) {
  return (
    (coords as TrackPoint[][])
      ?
      <LayerGroup key={hashString(JSON.stringify(coords))}>
        {
          (coords as TrackPoint[][]).map((trkSegsOrCoord) => {
            if (trkSegsOrCoord.length) {
              const trkSegs = trkSegsOrCoord;
              return trkSegs.map((coord) =>
                <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />);
            } else {
              const coord = trkSegsOrCoord as unknown as TrackPoint;
              return <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />
            }
          })
        }
      </LayerGroup>
      : null
  )
}