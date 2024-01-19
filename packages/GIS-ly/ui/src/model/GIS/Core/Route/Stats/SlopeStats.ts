import {
  SegmentNode
} from "../../../../Geometry/Polyline";
import {
  BasicStats,
  IRangeStatsResults,
  MaxMinStats,
  Median,
  RangeStatsResults,
  StandardDeviationStats,
  Sum
} from "../../../../Geometry/Stats";
import { INodeOfInterest } from "../../../../Geometry/Stats/INodeOfInterest";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

export interface ISlope {
  avg: number;
  uphill: IRangeStatsResults<RoutePoint, RouteSegment>;
  downhill: IRangeStatsResults<RoutePoint, RouteSegment>;
};

class SlopeStatsSigned
  extends BasicStats<RoutePoint, RouteSegment>
  implements IRangeStatsResults<RoutePoint, RouteSegment> {

  private _maxMin: MaxMinStats<RoutePoint, RouteSegment>;
  private _heightChange: Sum;
  private _length: Sum;

  get avg(): number {
    return this._length.value ? this._heightChange.value / this._length.value : 0;
  }

  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
    // return this._maxMin && (this._isConsidered && this._isConsidered(1))
    //   ? this._maxMin.range.max
    //   : this._maxMin.range.min;
    return this._maxMin?.range.max;

  }
  get min(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin?.range.min;
  }

  private _median: Median<RoutePoint, RouteSegment>;
  get mdn(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._median.median;
  }

  private _standardDev: StandardDeviationStats<RoutePoint, RouteSegment>;
  get std(): number {
    return this._standardDev.sigma;
  }

  protected override initializeProperties() {
    this._heightChange = new Sum();
    this._length = new Sum();

    this._median = new Median<RoutePoint, RouteSegment>(this.getSegSlope, this._isConsidered);

    const isSegmentProperty = true;
    this._maxMin = new MaxMinStats<RoutePoint, RouteSegment>(this.getSegSlope, isSegmentProperty, this._isConsidered);
    this._standardDev = new StandardDeviationStats<RoutePoint, RouteSegment>(
      this.getSegSlope,
      isSegmentProperty,
      this._isConsidered);
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

    this._median.add(segment);
    this._standardDev.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightChange.remove(segment.val.height);
    this._length.remove(segment.val.length);

    this._maxMin.remove(segment);

    this._median.remove(segment);
    this._standardDev.remove(segment);
  }

  serialize(): IRangeStatsResults<RoutePoint, RouteSegment> {
    const rangeResults = new RangeStatsResults(this);

    return rangeResults.serialize();
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
  get uphill(): IRangeStatsResults<RoutePoint, RouteSegment> {
    return this._uphill.serialize();
  }

  private _downhill: SlopeStatsSigned;
  get downhill(): IRangeStatsResults<RoutePoint, RouteSegment> {
    return this._downhill.serialize();
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