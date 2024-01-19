import {
  SegmentNode,
} from "../../../../Geometry/Polyline";
import {
  INodeOfInterest,
  BasicStats,
  MaxMinStats,
  Sum,
  Median,
  StandardDeviationStats,
  IRangeStatsResults,
  RangeStatsResults
} from "../../../../Geometry/Stats";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

export interface IHeight extends IRangeStatsResults<RoutePoint, RouteSegment> {
  net: number;
  gain: number;
  loss: number;
}

export class HeightStats
  extends BasicStats<RoutePoint, RouteSegment>
  implements IHeight {

  get net(): number {
    return this.getNetHeight();
  }

  private _gain: Sum;
  get gain(): number {
    return this._gain.value;
  }

  private _loss: Sum;
  get loss(): number {
    return this._loss.value;
  }

  private _average: Sum;
  get avg(): number {
    return this._average.mean();
  }

  private _maxMin: MaxMinStats<RoutePoint, RouteSegment>;
  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
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

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }

  protected getPtElevationOrAltitude(point: RoutePoint): number {
    return point?.elevation ?? point?.alt ?? 0;
  }

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


  protected getNetHeight(): number | undefined {
    const startElevation = this._firstVertex?.val?.elevation ?? this._firstVertex?.val?.alt ?? 0;
    const endElevation = this._lastVertex?.val?.elevation ?? this._lastVertex?.val?.alt ?? 0;

    return endElevation - startElevation;
  }

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