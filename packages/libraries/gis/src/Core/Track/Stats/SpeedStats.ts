import { SegmentNode } from "@MPT/geometry/Polyline";
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
 * @class SpeedStats
 * @typedef {SpeedStats}
 * @extends {BasicStats<TrackPoint, TrackSegment>}
 * @implements {IRangeStatsResults<TrackPoint, TrackSegment>}
 */
export class SpeedStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements IRangeStatsResults<TrackPoint, TrackSegment> {

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
 * @private
 * @type {Sum}
 */
  private _distance: Sum;
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
    return (this._duration && this._duration.value) ? this._distance.value / this._duration.value : 0;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._distance = new Sum();
    this._duration = new Sum();

    this._median = new Median<TrackPoint, TrackSegment>(this.getSegSpeed, this._isConsidered);

    const isSegmentProperty = true;

    this._maxMin = new MaxMinStats<TrackPoint, TrackSegment>(
      this.getSegSpeed,
      isSegmentProperty,
      this._isConsidered);

    this._standardDev = new StandardDeviationStats<TrackPoint, TrackSegment>(
      this.getSegSpeed,
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
  protected getSegSpeed(segment: TrackSegment): number {
    return segment?.speed;
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

    this._distance.add(segment.val.length);
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
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._distance.remove(segment.val.length);
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