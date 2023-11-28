import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicProperty,
  INodeOfInterest,
  MaxMinProperty,
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
  extends BasicProperty<TrackPoint, TrackSegment>
  implements ISpeed {

  private _maxMin: MaxMinProperty<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.max;
  }
  get min(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.min;
  }

  _distance: Sum;
  _duration: Sum;
  get avg(): number {
    return this._duration ? this._distance.value / this._duration.value : 0;
  }

  protected override initializeProperties() {
    this._distance = new Sum(this._isConsidered);
    this._duration = new Sum(this._isConsidered);
    this._maxMin = new MaxMinProperty<TrackPoint, TrackSegment>(this.getPtSpeed);
  }

  // TODO: See about using segment speed? And/or correct Pt average speeds to be weighted by neighboring seg durations
  protected getPtSpeed(point: TrackPoint): number {
    return point?.path.speed;
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment) {
      return;
    }

    this._distance.add(segment.val.length);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment) {
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