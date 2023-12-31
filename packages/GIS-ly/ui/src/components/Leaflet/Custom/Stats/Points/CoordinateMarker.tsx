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


export type CoordinateMarkerProps = {
  point: TrackPoint,
  segmentPrev?: TrackSegment,
  segmentNext?: TrackSegment
}

export function CoordinateMarker({ point, segmentPrev, segmentNext }: CoordinateMarkerProps) {
  const level = 1;

  return <Circle
    key={hashString(JSON.stringify(point))}
    center={[point.lat, point.lng]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={30}
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