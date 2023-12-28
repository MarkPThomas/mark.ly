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
import { useState } from 'react';
import { ToggleHeader } from '../../ToggleHeader';


export type CoordinateMarkerProps = {
  point: TrackPoint,
  segmentPrev?: TrackSegment,
  segmentNext?: TrackSegment
}

export function CoordinateMarker({ point, segmentPrev, segmentNext }: CoordinateMarkerProps) {
  const [showPath, setShowPath] = useState<boolean>(false);
  const [showPrevSeg, setShowPrevSeg] = useState<boolean>(false);
  const [showNextSeg, setShowNextSeg] = useState<boolean>(false);

  const handlePathClick = () => {
    setShowPath(!showPath);
  };

  const handlePrevSegClick = () => {
    setShowPrevSeg(!showPrevSeg);
  };

  const handleNextSegClick = () => {
    setShowNextSeg(!showNextSeg);
  };

  return <Circle
    key={hashString(JSON.stringify(point))}
    center={[point.lat, point.lng]}
    pathOptions={{ fillColor: 'red', color: 'black', weight: 1 }}
    radius={30}
  >
    <Popup>
      <span className={"popup-point"} >
        <h1>Track Point</h1>
        {point.timestamp ?
          <LabelValue label={'Timestamp'} value={point.timestamp} /> : null}
        <PointStats point={point} />
        {point.path ?
          <div>
            <ToggleHeader value={'Path'} cb={handlePathClick} />
            {showPath ? <PointPathStats path={point.path} /> : null}
          </div>
          : null}
        {segmentPrev ?
          <div>
            <ToggleHeader value={'Previous Segment'} cb={handlePrevSegClick} />
            {showPrevSeg ? <SegmentStats segment={segmentPrev} /> : null}
          </div>
          : null}
        {segmentNext ?
          <div>
            <ToggleHeader value={'Next Segment'} cb={handleNextSegClick} />
            {showNextSeg ? <SegmentStats segment={segmentNext} /> : null}
          </div>
          : null}
      </span>
    </Popup>
  </Circle>
}