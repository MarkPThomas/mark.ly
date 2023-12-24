import { SegmentNode } from "../../../../Geometry/Polyline";
import {
  BasicStats,
  INodeOfInterest,
  IRangeStatsResults,
  MaxMinStats,
  Median,
  RangeStatsResults,
  StandardDeviationStats,
  Sum
} from "../../../../Geometry/Stats";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export class SpeedStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements IRangeStatsResults<TrackPoint, TrackSegment> {

  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.max;
  }
  get min(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._maxMin?.range.min;
  }

  private _median: Median<TrackPoint, TrackSegment>;
  get mdn(): INodeOfInterest<TrackPoint, TrackSegment> {
    return this._median.median;
  }

  private _standardDev: StandardDeviationStats<TrackPoint, TrackSegment>;
  get std(): number {
    return this._standardDev.sigma;
  }

  private _distance: Sum;
  private _duration: Sum;
  get avg(): number {
    return (this._duration && this._duration.value) ? this._distance.value / this._duration.value : 0;
  }

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

  protected getSegSpeed(segment: TrackSegment): number {
    return segment?.speed;
  }

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

  serialize(): IRangeStatsResults<TrackPoint, TrackSegment> {
    const rangeResults = new RangeStatsResults(this);

    return rangeResults.serialize();
  }
}