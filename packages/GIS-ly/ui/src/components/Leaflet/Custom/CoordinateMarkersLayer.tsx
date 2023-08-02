import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer, TileLayerProps,
  LayerGroup,
  Marker, Popup,
  Circle,
  GeoJSON,
  useMap,
} from 'react-leaflet';

import { getBoundingBox, getCoords, Coordinate, metersToFeet } from '../../../model/Leaflet';

import { CoordinateMarker } from './CoordinateMarker';
import { hashString } from '../../../../../../common/utils';

export type CoordinateMarkersLayerProps = {
  coords
}

export function CoordinateMarkersLayer({ coords }: CoordinateMarkersLayerProps) {
  return (
    <LayerGroup key={hashString(JSON.stringify(coords))}>
      {
        (coords as Coordinate[][]).map((trkSegsOrCoord) => {
          console.log('coords: ', (coords as Coordinate[][]));
          console.log('trkSegsOrCoord: ', trkSegsOrCoord);
          if (trkSegsOrCoord.length) {
            const trkSegs = trkSegsOrCoord;
            return trkSegs.map((coord) => <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />);
          } else {
            const coord = trkSegsOrCoord as unknown as Coordinate;
            return <CoordinateMarker key={hashString(JSON.stringify(coord))} coord={coord} />
          }
        })
      }
    </LayerGroup>
  )
}