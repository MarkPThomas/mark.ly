import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry/Polyline";
import {
  INodeOfInterest,
  BasicProperty,
  MaxMinProperty,
  Sum
} from "../../../../Geometry/Properties";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

export interface IHeight {
  net: number;
  gain: number;
  loss: number;
  max: INodeOfInterest<RoutePoint, RouteSegment>;
  min: INodeOfInterest<RoutePoint, RouteSegment>;
}

export class HeightProperty
  extends BasicProperty<RoutePoint, RouteSegment>
  implements IHeight {

  private _net: number;
  get net(): number {
    return this._net;
  }

  private _maxMin: MaxMinProperty<RoutePoint, RouteSegment>;
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

  constructor(startVertex: VertexNode<RoutePoint, RouteSegment>) {
    super(startVertex);
    this.initialize(startVertex);
  }

  protected override initializeProperties() {
    this._gain = new Sum(this.isAscending);
    this._loss = new Sum(this.isDescending);
    this._maxMin = new MaxMinProperty<RoutePoint, RouteSegment>(this._startVertex, this.getPtElevation);
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }

  protected getPtElevation(point: RoutePoint): number {
    return point.elevation;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    this._net = this.getNetHeight();

    this._gain.add(segment.val.height);
    this._loss.add(segment.val.height);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    this._net = this.getNetHeight();

    this._gain.remove(segment.val.height);
    this._loss.remove(segment.val.height);

    this._maxMin.remove(segment);
  }


  protected getNetHeight(): number | undefined {
    // if (!start) {
    //   return 0;
    // }

    // if (start.val.elevation && end.val.elevation) {
    if (!this._startVertex || !this._endVertex) {
      return 0;
    }

    return this._endVertex.val.elevation - this._startVertex.val.elevation
    //   return end.val.alt - start.val.alt;
    // } else {
    //   console.log(`Start/End vertices don't have consistent elevation/altitude data`)
    //   return undefined;
    // }
  }


  // protected hasData(start: TVertex, end: TVertex): boolean {
  //   return this.hasElevation(start, end) || this.hasAltitude(start, end);
  // }

  // protected hasElevation(start: TVertex, end: TVertex): boolean {
  //   return start.elevation && end.elevation;
  // }

  // protected hasAltitude(start: TVertex, end: TVertex): boolean {
  //   return start.alt && end.alt;
  // }
}