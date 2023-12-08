import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicStats,
  INodeOfInterest,
  MaxMinStats,
  Sum
} from "../../../../Geometry/Stats";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface ISpeed {
  avg: number;
  max: INodeOfInterest<TrackPoint, TrackSegment>;
  min: INodeOfInterest<TrackPoint, TrackSegment>;
}

export class SpeedStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements ISpeed {

  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.max;
  }
  get min(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.min;
  }

  private _distance: Sum;
  private _duration: Sum;
  get avg(): number {
    return (this._duration && this._duration.value) ? this._distance.value / this._duration.value : 0;
  }

  protected override initializeProperties() {
    this._distance = new Sum();
    this._duration = new Sum();
    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(this.getSegSpeed, true);
  }

  protected getSegSpeed(segment: TrackSegment): number {
    return segment?.speed;
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._distance.add(segment.val.length);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._distance.remove(segment.val.length);
    this._duration.remove(segment.val.duration);

    this._maxMin.remove(segment);
  }

  serialize(): ISpeed {
    return {
      avg: this.avg,
      max: this.max,
      min: this.min
    }
  }
}