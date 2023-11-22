import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicProperty,
  INodeOfInterest,
  MaxMinProperty,
  Sum
} from "../../../../Geometry/Properties";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

interface IHeightRateSigned {
  avg: number;
  max: INodeOfInterest<TrackPoint, TrackSegment>;
}

export interface IHeightRate {
  ascent: IHeightRateSigned;
  descent: IHeightRateSigned;
};


class HeightRateSigned
  extends BasicProperty<TrackPoint, TrackSegment>
  implements IHeightRateSigned {
  private _heightTotal: Sum;
  private _duration: Sum;

  get avg(): number {
    return this._duration.value ? this._heightTotal.value / this._duration.value : 0;
  }
  private _maxMin: MaxMinProperty<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.max;
  }

  protected override initializeProperties() {
    this._heightTotal = new Sum(this._isConsidered);
    this._duration = new Sum(this._isConsidered);
    this._maxMin = new MaxMinProperty<TrackPoint, TrackSegment>(this._startVertex, this.getPtElevation);
  }

  protected getPtElevation(point: TrackPoint): number {
    return point.elevation;
  }

  add(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._heightTotal.add(segment.val.height);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._heightTotal.add(segment.val.height);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._heightTotal.remove(segment.val.height);
    this._duration.remove(segment.val.duration);

    this._maxMin.remove(segment);
  }
}
export class HeightRateProperty
  extends BasicProperty<TrackPoint, TrackSegment>
  implements IHeightRate {

  private _ascent: HeightRateSigned;
  get ascent(): IHeightRateSigned {
    return {
      avg: this._ascent.avg,
      max: this._ascent.max
    }
  }

  private _descent: HeightRateSigned;
  get descent(): IHeightRateSigned {
    return {
      avg: this._descent.avg,
      max: this._descent.max
    }
  }

  protected override initializeProperties() {
    this._ascent = new HeightRateSigned(this._startVertex, this.isAscending);
    this._descent = new HeightRateSigned(this._startVertex, this.isDescending);
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.add(segment);
    this._descent.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.remove(segment);
    this._descent.remove(segment);
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }
}