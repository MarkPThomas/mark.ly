import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry/Polyline";
import {
  IPointOfInterest,
  MaxMin,
  Sum
} from "../../../../Geometry/Properties";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

export interface IHeight {
  net: number;
  gain: number;
  loss: number;
  max: IPointOfInterest;
  min: IPointOfInterest;
}

export class HeightProperty implements IHeight {
  net: number;

  _range: MaxMin<VertexNode<RoutePoint, RouteSegment>>;
  get max(): IPointOfInterest<VertexNode<RoutePoint, RouteSegment>> {
    return this._range.max;
  }
  get min(): IPointOfInterest<VertexNode<RoutePoint, RouteSegment>> {
    return this._range.min;
  }

  _gain: Sum;
  get gain(): number {
    return this._gain.value;
  }

  _loss: Sum;
  get loss(): number {
    return this._loss.value;
  }

  private _useAltitude;

  constructor(useAltitude = false) {
    this._useAltitude = useAltitude;

    this._gain = new Sum(this.isAscending);
    this._loss = new Sum(this.isDescending);
    this._range = new MaxMin<VertexNode<RoutePoint, RouteSegment>>();
  }

  fromTo(
    start: VertexNode<RoutePoint, RouteSegment>,
    end: VertexNode<RoutePoint, RouteSegment>
  ): void {
    this.net = this.getNetHeight(start, end);

    this._gain = new Sum(this.isAscending);
    this._loss = new Sum(this.isDescending);
    this._range = new MaxMin<VertexNode<RoutePoint, RouteSegment>>();

    let segNode = start.nextSeg;
    while (segNode) {
      this.add(segNode);

      if (segNode.nextVert === end) {
        break;
      } else {
        segNode = segNode.next as SegmentNode<RoutePoint, RouteSegment>;
      }
    }
  }

  add(segment: SegmentNode<RoutePoint, RouteSegment>) {
    // TODO: Consider how to handle net height
    this._gain.add(segment.val.height);
    this._loss.add(segment.val.height);

    this._range.add(segment.prevVert.val.elevation);
    this._range.add(segment.nextVert.val.elevation);
  }

  remove(segment: SegmentNode<RoutePoint, RouteSegment>) {
    // TODO: Consider how to handle net height
    this._gain.add(segment.val.height);
    this._loss.add(segment.val.height);

    this._range = new MaxMin();
  }

  protected getNetHeight(
    start: VertexNode<RoutePoint, RouteSegment>,
    end: VertexNode<RoutePoint, RouteSegment>
  ): number | undefined {
    // if (!start) {
    //   return 0;
    // }

    // if (start.val.elevation && end.val.elevation) {
    return end.val.elevation - start.val.elevation;
    // } else if (start.val.alt && end.val.alt) {
    //   return end.val.alt - start.val.alt;
    // } else {
    //   console.log(`Start/End vertices don't have consistent elevation/altitude data`)
    //   return undefined;
    // }
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
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