import { SegmentNode } from "@markpthomas/geometry/polyline";
import {
  BasicStats,
  INodeOfInterest,
  IRangeStatsResults,
  MaxMinStats,
  Median,
  RangeStatsResults,
  StandardDeviationStats,
  Sum
} from "@markpthomas/geometry/stats";

import { TimeStamp } from "../../Time";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface ITime
 * @typedef {ITime}
 * @extends {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
export interface ITime extends IRangeStatsResults<TrackPoint, TrackSegment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  duration: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @class TimeStats
 * @typedef {TimeStats}
 * @extends {BasicStats<TrackPoint, TrackSegment>}
 * @implements {ITime}
 */
export class TimeStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements ITime {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {Sum}
 */
  private _times: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {number}
 */
  get avg(): number {
    return this._times.mean();
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
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {number}
 */
  get duration(): number {
    if (!this._firstVertex) {
      return 0;
    }

    return TimeStamp.calcIntervalSec(this._firstVertex.val.timestamp, this._lastVertex.val.timestamp);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._times = new Sum();

    this._median = new Median<TrackPoint, TrackSegment>(this.getSegDuration, this._isConsidered);

    const isSegmentProperty = true;

    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(
      this.getSegDuration,
      isSegmentProperty,
      this._isConsidered);

    this._standardDev = new StandardDeviationStats<TrackPoint, TrackSegment>(
      this.getSegDuration,
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
  protected getSegDuration(segment: TrackSegment): number {
    return segment?.duration;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 */
  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._times.add(segment.val.duration);

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
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._times.remove(segment.val.duration);

    this._maxMin.remove(segment);

    this._median.remove(segment);
    this._standardDev.add(segment);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {ITime}
 */
  serialize(): ITime {
    const rangeResults = new RangeStatsResults(this);

    return {
      duration: this.duration,
      ...rangeResults.serialize()
    }
  }
}