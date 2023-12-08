import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicStats,
  INodeOfInterest,
  MaxMinStats,
  Sum
} from "../../../../Geometry/Stats";

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

class HeightRateStatsSigned
  extends BasicStats<TrackPoint, TrackSegment>
  implements IHeightRateSigned {
  private _heightTotal: Sum;
  private _duration: Sum;

  get avg(): number {
    return this._duration.value ? this._heightTotal.value / this._duration.value : 0;
  }
  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin && (this._isConsidered && this._isConsidered(1))
      ? this._maxMin.range.max
      : this._maxMin.range.min;
  }

  protected override initializeProperties() {
    this._heightTotal = new Sum();
    this._duration = new Sum();
    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(this.getHeightRate, true);
  }

  protected getHeightRate(segment: TrackSegment): number {
    return segment?.heightRate;
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightTotal.add(segment.val.height);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightTotal.remove(segment.val.height);
    this._duration.remove(segment.val.duration);

    this._maxMin.remove(segment);
  }

  serialize(): IHeightRateSigned {
    return {
      avg: this.avg,
      max: this.max
    }
  }
}

export class HeightRateStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements IHeightRate {

  private _ascent: HeightRateStatsSigned;
  get ascent(): IHeightRateSigned {
    return {
      avg: this._ascent.avg,
      max: this._ascent.max
    }
  }

  private _descent: HeightRateStatsSigned;
  get descent(): IHeightRateSigned {
    return {
      avg: this._descent.avg,
      max: this._descent.max
    }
  }

  protected override initializeProperties() {
    this._ascent = new HeightRateStatsSigned(this.isAscending);
    this._descent = new HeightRateStatsSigned(this.isDescending);
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

  serialize(): IHeightRate {
    return {
      ascent: this._ascent.serialize(),
      descent: this._descent.serialize()
    }
  }
}