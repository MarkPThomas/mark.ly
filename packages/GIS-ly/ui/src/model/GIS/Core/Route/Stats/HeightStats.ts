import {
  SegmentNode,
} from "../../../../Geometry/Polyline";
import {
  INodeOfInterest,
  BasicStats,
  MaxMinStats,
  Sum
} from "../../../../Geometry/Stats";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

export interface IHeight {
  net: number;
  gain: number;
  loss: number;
  max: INodeOfInterest<RoutePoint, RouteSegment>;
  min: INodeOfInterest<RoutePoint, RouteSegment>;
}

export class HeightStats
  extends BasicStats<RoutePoint, RouteSegment>
  implements IHeight {

  get net(): number {
    return this.getNetHeight();
  }

  private _maxMin: MaxMinStats<RoutePoint, RouteSegment>;
  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin?.range.max;
  }
  get min(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin?.range.min;
  }

  private _gain: Sum;
  get gain(): number {
    return this._gain.value;
  }

  private _loss: Sum;
  get loss(): number {
    return this._loss.value;
  }

  protected override initializeProperties() {
    this._gain = new Sum(this.isAscending);
    this._loss = new Sum(this.isDescending);
    this._maxMin = new MaxMinStats<RoutePoint, RouteSegment>(this.getPtElevation, false, this._isConsidered);
  }

  protected isAscending(number: number): boolean {
    if (this._isConsidered) {
      // if (this._isConsidered && this._isConsidered(number)) {
      console.log('Consider Meeee!', number);
    }
    // return (!this._isConsidered || this._isConsidered(number)) && number > 0;
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    // if (this._isConsidered && this._isConsidered(number)) {
    //   console.log('Consider Meeee!', number);
    // }
    // return (!this._isConsidered || this._isConsidered(number)) && number < 0;
    return number < 0;
  }

  protected getPtElevation(point: RoutePoint): number {
    return point?.elevation;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._gain.add(segment.val.height);
    this._loss.add(segment.val.height);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._gain.remove(segment.val.height);
    this._loss.remove(segment.val.height);

    this._maxMin.remove(segment);
  }


  protected getNetHeight(): number | undefined {
    const startElevation = this._startVertex?.val?.elevation ?? 0;
    const endElevation = this._endVertex?.val?.elevation ?? 0;

    return endElevation - startElevation;
  }

  serialize(): IHeight {
    return {
      net: this.net,
      gain: this.gain,
      loss: this.loss,
      max: this.max,
      min: this.min
    }
  }
}