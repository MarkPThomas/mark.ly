import {
  SegmentNode
} from "@markpthomas/geometry/polyline";
import {
  BasicStats,
  IRangeStatsResults,
  MaxMinStats,
  Median,
  RangeStatsResults,
  StandardDeviationStats,
  Sum
} from "@markpthomas/geometry/stats";
import { INodeOfInterest } from "@markpthomas/geometry/stats/INodeOfInterest";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface ISlope
 * @typedef {ISlope}
 */
export interface ISlope {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  avg: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
  uphill: IRangeStatsResults<RoutePoint, RouteSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
  downhill: IRangeStatsResults<RoutePoint, RouteSegment>;
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @class SlopeStatsSigned
 * @typedef {SlopeStatsSigned}
 * @extends {BasicStats<RoutePoint, RouteSegment>}
 * @implements {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
class SlopeStatsSigned
  extends BasicStats<RoutePoint, RouteSegment>
  implements IRangeStatsResults<RoutePoint, RouteSegment> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {MaxMinStats<RoutePoint, RouteSegment>}
 */
  private _maxMin: MaxMinStats<RoutePoint, RouteSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Sum}
 */
  private _heightChange: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Sum}
 */
  private _length: Sum;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get avg(): number {
    return this._length.value ? this._heightChange.value / this._length.value : 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {INodeOfInterest<RoutePoint, RouteSegment>}
 */
  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
    // return this._maxMin && (this._isConsidered && this._isConsidered(1))
    //   ? this._maxMin.range.max
    //   : this._maxMin.range.min;
    return this._maxMin?.range.max;

  }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {INodeOfInterest<RoutePoint, RouteSegment>}
 */
  get min(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin?.range.min;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Median<RoutePoint, RouteSegment>}
 */
  private _median: Median<RoutePoint, RouteSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {INodeOfInterest<RoutePoint, RouteSegment>}
 */
  get mdn(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._median.median;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {StandardDeviationStats<RoutePoint, RouteSegment>}
 */
  private _standardDev: StandardDeviationStats<RoutePoint, RouteSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get std(): number {
    return this._standardDev.sigma;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {RouteSegment} segment
 * @returns {number}
 */
  protected getSegSlope(segment: RouteSegment): number {
    return segment?.slope;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {SegmentNode<RoutePoint, RouteSegment>} segment
 */
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

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {SegmentNode<RoutePoint, RouteSegment>} segment
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
  serialize(): IRangeStatsResults<RoutePoint, RouteSegment> {
    const rangeResults = new RangeStatsResults(this);

    return rangeResults.serialize();
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @class SlopeStats
 * @typedef {SlopeStats}
 * @extends {BasicStats<RoutePoint, RouteSegment>}
 * @implements {ISlope}
 */
export class SlopeStats
  extends BasicStats<RoutePoint, RouteSegment>
  implements ISlope {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {number}
 */
  private _totalLength: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {number}
 */
  private _totalHeight: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get avg(): number {
    return this._totalLength ? this._totalHeight / this._totalLength : 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {SlopeStatsSigned}
 */
  private _uphill: SlopeStatsSigned;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
  get uphill(): IRangeStatsResults<RoutePoint, RouteSegment> {
    return this._uphill.serialize();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {SlopeStatsSigned}
 */
  private _downhill: SlopeStatsSigned;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
  get downhill(): IRangeStatsResults<RoutePoint, RouteSegment> {
    return this._downhill.serialize();
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._uphill = new SlopeStatsSigned(this.isAscending);
    this._downhill = new SlopeStatsSigned(this.isDescending);
    this._totalLength = 0;
    this._totalHeight = 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {number} number
 * @returns {boolean}
 */
  protected isAscending(number: number): boolean {
    return number > 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {number} number
 * @returns {boolean}
 */
  protected isDescending(number: number): boolean {
    return number < 0;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {SegmentNode<RoutePoint, RouteSegment>} segment
 */
  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength += segment.val.length;
    this._totalHeight += segment.val.height;

    this._uphill.add(segment);
    this._downhill.add(segment);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {SegmentNode<RoutePoint, RouteSegment>} segment
 */
  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength -= segment.val.length;
    this._totalHeight -= segment.val.height;

    this._uphill.remove(segment);
    this._downhill.remove(segment);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {ISlope}
 */
  serialize(): ISlope {
    return {
      avg: this.avg,
      uphill: this._uphill.serialize(),
      downhill: this._downhill.serialize()
    }
  }
}