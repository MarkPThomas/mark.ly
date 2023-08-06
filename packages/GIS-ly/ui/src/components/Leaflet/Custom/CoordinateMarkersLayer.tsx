import React from 'react';
import {
  LayerGroup
} from 'react-leaflet';

import { hashString } from '../../../../../../common/utils';

import { Coordinate } from '../../../model/GIS/Coordinate';

import { CoordinateMarker } from './CoordinateMarker';

export type CoordinateMarkersLayerProps = {
  coords
}

export function CoordinateMarkersLayer({ coords }: CoordinateMarkersLayerProps) {
  return (
    (coords as Coordinate[][])
      ?
      <LayerGroup key={hashString(JSON.stringify(coords))}>
        {
          (coords as Coordinate[][]).map((trkSegsOrCoord) => {
            if (trkSegsOrCoord.length) {
              const trkSegs = trkSegsOrCoord;
              return trkSegs.map((coord) =>
                <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />);
            } else {
              const coord = trkSegsOrCoord as unknown as Coordinate;
              return <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />
            }
          })
        }
      </LayerGroup>
      : null
  )
}