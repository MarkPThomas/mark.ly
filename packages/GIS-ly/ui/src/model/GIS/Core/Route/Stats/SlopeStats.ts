import {
  SegmentNode
} from "../../../../Geometry/Polyline";
import {
  BasicStats,
  MaxMinStats,
  Sum
} from "../../../../Geometry/Stats";
import { INodeOfInterest } from "../../../../Geometry/Stats/INodeOfInterest";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

interface ISlopeSigned {
  avg: number;
  max: INodeOfInterest<RoutePoint, RouteSegment>;
}

export interface ISlope {
  avg: number;
  uphill: ISlopeSigned;
  downhill: ISlopeSigned;
};

class SlopeStatsSigned
  extends BasicStats<RoutePoint, RouteSegment>
  implements ISlopeSigned {

  private _maxMin: MaxMinStats<RoutePoint, RouteSegment>;
  private _heightChange: Sum;
  private _length: Sum;

  get avg(): number {
    return this._length.value ? this._heightChange.value / this._length.value : 0;
  }

  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin && (this._isConsidered && this._isConsidered(1))
      ? this._maxMin.range.max
      : this._maxMin.range.min;
  }

  protected override initializeProperties() {
    this._heightChange = new Sum();
    this._length = new Sum();

    this._maxMin = new MaxMinStats<RoutePoint, RouteSegment>(this.getSegSlope, true);
  }

  protected getSegSlope(segment: RouteSegment): number {
    return segment?.slope;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightChange.add(segment.val.height);
    this._length.add(segment.val.length);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._heightChange.remove(segment.val.height);
    this._length.remove(segment.val.length);

    this._maxMin.remove(segment);
  }

  serialize(): ISlopeSigned {
    return {
      avg: this.avg,
      max: this.max
    }
  }
}

export class SlopeStats
  extends BasicStats<RoutePoint, RouteSegment>
  implements ISlope {

  private _totalLength: number;
  private _totalHeight: number;
  get avg(): number {
    return this._totalLength ? this._totalHeight / this._totalLength : 0;
  }

  private _uphill: SlopeStatsSigned;
  get uphill(): ISlopeSigned {
    return {
      avg: this._uphill.avg,
      max: this._uphill.max
    }
  }

  private _downhill: SlopeStatsSigned;
  get downhill(): ISlopeSigned {
    return {
      avg: this._downhill.avg,
      max: this._downhill.max
    }
  }

  protected override initializeProperties() {
    this._uphill = new SlopeStatsSigned(this.isAscending);
    this._downhill = new SlopeStatsSigned(this.isDescending);
    this._totalLength = 0;
    this._totalHeight = 0;
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength += segment.val.length;
    this._totalHeight += segment.val.height;

    this._uphill.add(segment);
    this._downhill.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength -= segment.val.length;
    this._totalHeight -= segment.val.height;

    this._uphill.remove(segment);
    this._downhill.remove(segment);
  }

  serialize(): ISlope {
    return {
      avg: this.avg,
      uphill: this._uphill.serialize(),
      downhill: this._downhill.serialize()
    }
  }
}