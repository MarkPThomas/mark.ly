import {
  LayerGroup
} from 'react-leaflet';

import { hashString } from '../../../../../../../../common/utils';

import { TrackPoint } from '../../../../../model/GIS/Core/Track/TrackPoint';

import { CoordinateMarker } from './CoordinateMarker';
import { TrackSegment } from '../../../../../model/GIS/Core/Track';

export type CoordinateMarkersLayerProps = {
  points: TrackPoint[],
  segments?: TrackSegment[]
}

export function CoordinateMarkersLayer({ points, segments }: CoordinateMarkersLayerProps) {
  const getPrevSegment = (index: number) => {
    return index === 0 ? null : segments[index];
  }

  const getNextSegment = (index: number) => {
    return index < segments.length ? segments[index] : null;
  }

  return (
    // (points as TrackPoint[])
    //   ?
    <LayerGroup key={hashString(JSON.stringify(points))}>
      {points.map((point: TrackPoint, index: number) =>
        <CoordinateMarker
          key={hashString(JSON.stringify(point))}
          point={point}
          segmentPrev={getPrevSegment(index)}
          segmentNext={getNextSegment(index + 1)}
        />
      )}
    </LayerGroup>
    // : null
  )
}