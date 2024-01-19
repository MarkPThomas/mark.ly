import {
  Popup,
  Circle
} from 'react-leaflet';

import { hashString } from '../../../../../../../../common/utils'; //'common/utils';

import { TrackPoint } from '../../../../../model/GIS/Core/Track/TrackPoint';

import { LabelValue } from '../../LabelValueList';
import { PointStats } from './Categories/PointStats';
import { PointPathStats } from './Categories/PointPathStats';
import { TrackSegment } from '../../../../../model/GIS/Core/Track';
import { SegmentStats } from './Categories/SegmentStats';
import { ToggleGroup } from '../../ToggleGroup';
import { PathOptions } from 'leaflet';


export type CoordinateMarkerProps = {
  point: TrackPoint,
  segmentPrev?: TrackSegment,
  segmentNext?: TrackSegment,
  pathOptions?: PathOptions,
  radius?: number
  useAltColor?: boolean;
}

export function CoordinateMarker({ point, segmentPrev, segmentNext, pathOptions, radius, useAltColor }: CoordinateMarkerProps) {
  const level = 1;

  const pathOptionsDefault: PathOptions = {
    fillColor: useAltColor ? 'yellow' : 'red',
    color: 'black',
    weight: 1,
    opacity: 0.5
  }

  const radiusDefault = 30;

  const pathOptionsUse: PathOptions = {
    ...pathOptionsDefault,
    ...pathOptions
  }

  const radiusUse = radius ?? radiusDefault;

  return <Circle
    key={hashString(JSON.stringify(point))}
    center={[point.lat, point.lng]}
    pathOptions={pathOptionsUse}
    radius={radiusUse}
  >
    <Popup>
      <span className={"popup-point"} >
        <h1>Track Point</h1>
        <LabelValue label={'Timestamp'} value={point.timestamp} />
        <PointStats point={point} />
        {point.path ?
          <ToggleGroup value={'Path'} level={level} children={[<PointPathStats key={Date()} path={point.path} />]} />
          : null}
        {segmentPrev ?
          <ToggleGroup value={'Previous Segment'} level={level} children={[<SegmentStats key={Date()} segment={segmentPrev} />]} />
          : null}
        {segmentNext ?
          <ToggleGroup value={'Next Segment'} level={level} children={[<SegmentStats key={Date()} segment={segmentNext} />]} />
          : null}
      </span>
    </Popup>
  </Circle>
}