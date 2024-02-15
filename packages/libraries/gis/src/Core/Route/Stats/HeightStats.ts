import {
  SegmentNode,
} from "@markpthomas/geometry/polyline";
import {
  INodeOfInterest,
  BasicStats,
  MaxMinStats,
  Sum,
  Median,
  StandardDeviationStats,
  IRangeStatsResults,
  RangeStatsResults
} from "@markpthomas/geometry/stats";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface IHeight
 * @typedef {IHeight}
 * @extends {IRangeStatsResults<RoutePoint, RouteSegment>}
 */
export interface IHeight extends IRangeStatsResults<RoutePoint, RouteSegment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  net: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  gain: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  loss: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @class HeightStats
 * @typedef {HeightStats}
 * @extends {BasicStats<RoutePoint, RouteSegment>}
 * @implements {IHeight}
 */
export class HeightStats
  extends BasicStats<RoutePoint, RouteSegment>
  implements IHeight {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get net(): number {
    return this.getNetHeight();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Sum}
 */
  private _gain: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get gain(): number {
    return this._gain.value;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Sum}
 */
  private _loss: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get loss(): number {
    return this._loss.value;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @type {Sum}
 */
  private _average: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {number}
 */
  get avg(): number {
    return this._average.mean();
  }

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
 * @readonly
 * @type {INodeOfInterest<RoutePoint, RouteSegment>}
 */
  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
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
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {RoutePoint} point
 * @returns {number}
 */
  protected getPtElevationOrAltitude(point: RoutePoint): number {
    return point?.elevation ?? point?.alt ?? 0;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._gain = new Sum(this.isAscending);
    this._loss = new Sum(this.isDescending);
    this._average = new Sum();
    this._median = new Median<RoutePoint, RouteSegment>(this.getPtElevationOrAltitude, this._isConsidered);

    const isSegmentProperty = false;
    this._standardDev = new StandardDeviationStats<RoutePoint, RouteSegment>(
      this.getPtElevationOrAltitude,
      isSegmentProperty,
      this._isConsidered);
    this._maxMin = new MaxMinStats<RoutePoint, RouteSegment>(
      this.getPtElevationOrAltitude,
      isSegmentProperty,
      this._isConsidered);
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

    this._gain.add(segment.val.height);
    this._loss.add(segment.val.height);

    this._average.add(this.getPtElevationOrAltitude(segment.prevVert.val));

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

    this._gain.remove(segment.val.height);
    this._loss.remove(segment.val.height);

    this._average.remove(this.getPtElevationOrAltitude(segment.prevVert.val));

    this._maxMin.remove(segment);
    this._median.remove(segment);
    this._standardDev.remove(segment);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @returns {(number | undefined)}
 */
  protected getNetHeight(): number | undefined {
    const startElevation = this._firstVertex?.val?.elevation ?? this._firstVertex?.val?.alt ?? 0;
    const endElevation = this._lastVertex?.val?.elevation ?? this._lastVertex?.val?.alt ?? 0;

    return endElevation - startElevation;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {IHeight}
 */
  serialize(): IHeight {
    const rangeResults = new RangeStatsResults(this);

    return {
      net: this.net,
      gain: this.gain,
      loss: this.loss,
      ...rangeResults.serialize()
    }
  }
}