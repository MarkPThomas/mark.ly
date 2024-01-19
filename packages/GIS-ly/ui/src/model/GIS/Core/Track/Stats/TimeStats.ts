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
import { TimeStamp } from "../../Time";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface ITime extends IRangeStatsResults<TrackPoint, TrackSegment> {
  duration: number;
}

export class TimeStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements ITime {

  private _times: Sum;
  get avg(): number {
    return this._times.mean();
  }

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

  get duration(): number {
    if (!this._firstVertex) {
      return 0;
    }

    return TimeStamp.calcIntervalSec(this._firstVertex.val.timestamp, this._lastVertex.val.timestamp);
  }

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

  protected getSegDuration(segment: TrackSegment): number {
    return segment?.duration;
  }

  protected override addProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._times.add(segment.val.duration);

    this._maxMin.add(segment);

    this._median.add(segment);
    this._standardDev.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<TrackPoint, TrackSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.speed))) {
      return;
    }

    this._times.remove(segment.val.duration);

    this._maxMin.remove(segment);

    this._median.remove(segment);
    this._standardDev.add(segment);
  }

  serialize(): ITime {
    const rangeResults = new RangeStatsResults(this);

    return {
      duration: this.duration,
      ...rangeResults.serialize()
    }
  }
}