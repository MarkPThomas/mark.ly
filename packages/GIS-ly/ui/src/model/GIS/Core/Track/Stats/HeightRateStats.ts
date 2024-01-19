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

export interface IHeightRate {
  ascent: IRangeStatsResults<TrackPoint, TrackSegment>;
  descent: IRangeStatsResults<TrackPoint, TrackSegment>;
};

class HeightRateStatsSigned
  extends BasicStats<TrackPoint, TrackSegment>
  implements IRangeStatsResults<TrackPoint, TrackSegment> {

  private _heightTotal: Sum;
  private _duration: Sum;
  get avg(): number {
    return this._duration.value ? this._heightTotal.value / this._duration.value : 0;
  }

  private _maxMin: MaxMinStats<TrackPoint, TrackSegment>;
  get max(): INodeOfInterest<TrackPoint, TrackSegment> {
    // return this._maxMin && (this._isConsidered && this._isConsidered(1))
    //   ? this._maxMin.range.max
    //   : this._maxMin.range.min;
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

    this._median.add(segment);
    this._standardDev.add(segment);
  }

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

  serialize(): IRangeStatsResults<TrackPoint, TrackSegment> {
    const rangeResults = new RangeStatsResults(this);

    return rangeResults.serialize();
  }
}

export class HeightRateStats
  extends BasicStats<TrackPoint, TrackSegment>
  implements IHeightRate {

  private _ascent: HeightRateStatsSigned;
  get ascent(): IRangeStatsResults<TrackPoint, TrackSegment> {
    return this._ascent.serialize();
  }

  private _descent: HeightRateStatsSigned;
  get descent(): IRangeStatsResults<TrackPoint, TrackSegment> {
    return this._descent.serialize();
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