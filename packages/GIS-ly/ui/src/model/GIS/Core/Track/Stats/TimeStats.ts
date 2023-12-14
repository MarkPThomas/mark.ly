import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicStats,
  INodeOfInterest,
  MaxMinStats
} from "../../../../Geometry/Stats";
import { TimeStamp } from "../../Time";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface ITime {
  duration: number;
  maxInterval: INodeOfInterest<TrackPoint, TrackSegment>;
  minInterval: INodeOfInterest<TrackPoint, TrackSegment>;
  // Median interval
  // Standard Deviations interval
}

export class TimeStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements ITime {

  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  get maxInterval(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.max;
  }
  get minInterval(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.min;
  }

  get duration(): number {
    if (!this._startVertex) {
      return 0;
    }

    return TimeStamp.calcIntervalSec(this._startVertex.val.timestamp, this._endVertex.val.timestamp);
  }

  protected override initializeProperties() {
    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(this.getSegDuration, true);
  }

  protected getSegDuration(segment: TrackSegment): number {
    return segment?.duration;
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }



    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }


    this._maxMin.remove(segment);
  }

  serialize(): ITime {
    return {
      duration: this.duration,
      maxInterval: this.maxInterval,
      minInterval: this.minInterval
    }
  }
}