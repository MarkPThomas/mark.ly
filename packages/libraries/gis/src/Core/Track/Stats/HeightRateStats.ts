import { SegmentNode } from "@MPT/geometry";
import {
  BasicStats,
  INodeOfInterest,
  IRangeStatsResults,
  MaxMinStats,
  Median,
  RangeStatsResults,
  StandardDeviationStats,
  Sum
} from "@MPT/geometry/Stats";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IHeightRate
 * @typedef {IHeightRate}
 */
export interface IHeightRate {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
  ascent: IRangeStatsResults<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
  descent: IRangeStatsResults<TrackPoint, TrackSegment>;
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @class HeightRateStatsSigned
 * @typedef {HeightRateStatsSigned}
 * @extends {BasicStats<TrackPoint, TrackSegment>}
 * @implements {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
class HeightRateStatsSigned
  extends BasicStats<TrackPoint, TrackSegment>
  implements IRangeStatsResults<TrackPoint, TrackSegment> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {Sum}
 */
  private _heightTotal: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {Sum}
 */
  private _duration: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {number}
 */
  get avg(): number {
    return this._duration.value ? this._heightTotal.value / this._duration.value : 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {MaxMinStats<TrackPoint, TrackSegment>}
 */
  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {INodeOfInterest<TrackPoint, TrackSegment>}
 */
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    // return this._maxMin && (this._isConsidered && this._isConsidered(1))
    //   ? this._maxMin.range.max
    //   : this._maxMin.range.min;
    return this._maxMin?.range.max;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {INodeOfInterest<TrackPoint, TrackSegment>}
 */
  get min(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.min;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {Median<TrackPoint, TrackSegment>}
 */
  private _median: Median<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {INodeOfInterest<TrackPoint, TrackSegment>}
 */
  get mdn(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._median.median;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {StandardDeviationStats<TrackPoint, TrackSegment>}
 */
  private _standardDev: StandardDeviationStats<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {number}
 */
  get std(): number {
    return this._standardDev.sigma;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._heightTotal = new Sum();
    this._duration = new Sum();

    this._median = new Median<TrackPoint, TrackSegment>(this.getHeightRate, this._isConsidered);

    const isSegmentProperty = true;

    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(
      this.getHeightRate,
      isSegmentProperty,
      this._isConsidered);

    this._standardDev = new StandardDeviationStats<TrackPoint, TrackSegment>(
      this.getHeightRate,
      isSegmentProperty,
      this._isConsidered);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {TrackSegment} segment
 * @returns {number}
 */
  protected getHeightRate(segment: TrackSegment): number {
    return segment?.heightRate;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 */
  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightTotal.add(segment.val.height);
    this._duration.add(segment.val.duration);

    this._maxMin.add(segment);

    this._median.add(segment);
    this._standardDev.add(segment);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 */
  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.height))) {
      return;
    }

    this._heightTotal.remove(segment.val.height);
    this._duration.remove(segment.val.duration);

    this._maxMin.remove(segment);

    this._median.remove(segment);
    this._standardDev.remove(segment);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
  serialize(): IRangeStatsResults<TrackPoint, TrackSegment> {
    const rangeResults = new RangeStatsResults(this);

    return rangeResults.serialize();
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @class HeightRateStats
 * @typedef {HeightRateStats}
 * @extends {BasicStats<TrackPoint, TrackSegment>}
 * @implements {IHeightRate}
 */
export class HeightRateStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements IHeightRate {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {HeightRateStatsSigned}
 */
  private _ascent: HeightRateStatsSigned;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
  get ascent(): IRangeStatsResults<TrackPoint, TrackSegment> {
    return this._ascent.serialize();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {HeightRateStatsSigned}
 */
  private _descent: HeightRateStatsSigned;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
  get descent(): IRangeStatsResults<TrackPoint, TrackSegment> {
    return this._descent.serialize();
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._ascent = new HeightRateStatsSigned(this.isAscending);
    this._descent = new HeightRateStatsSigned(this.isDescending);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 */
  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.add(segment);
    this._descent.add(segment);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 */
  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.remove(segment);
    this._descent.remove(segment);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
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
 * @date 2/11/2024 - 6:34:54 PM
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
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {IHeightRate}
 */
  serialize(): IHeightRate {
    return {
      ascent: this._ascent.serialize(),
      descent: this._descent.serialize()
    }
  }
}