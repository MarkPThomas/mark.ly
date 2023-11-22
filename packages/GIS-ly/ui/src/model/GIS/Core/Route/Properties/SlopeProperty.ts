import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry";
import { MaxMin, Sum } from "../../../../Geometry/Properties";
import { IPointOfInterest } from "../../../../Geometry/Properties/IPointOfInterest";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

interface ISlopeSigned {
  avg: number;
  max: IPointOfInterest;
}

export interface ISlope {
  avg: number;
  uphill: ISlopeSigned;
  downhill: ISlopeSigned;
};


class SlopeSigned implements ISlopeSigned {
  private _range: MaxMin<VertexNode<RoutePoint, RouteSegment>>;
  private _gain: Sum;
  private _gainLength: Sum;

  get avg(): number {
    return this._gainLength.value ? this._gain.value / this._gainLength.value : 0;
  }

  get max(): IPointOfInterest<VertexNode<RoutePoint, RouteSegment>> {
    return this._range.max;
  }

  constructor(isConsidered: (number: number) => boolean) {
    this._range = new MaxMin<VertexNode<RoutePoint, RouteSegment>>();

    this._gain = new Sum(isConsidered);
    this._gainLength = new Sum(isConsidered);
  }

  add(segment: SegmentNode<RoutePoint, RouteSegment>) {
    this._gain.add(segment.val.height);
    this._gainLength.add(segment.val.length);

    this._range.add(segment.prevVert.val.elevation);
    this._range.add(segment.nextVert.val.elevation);
  }

  remove(segment: SegmentNode<RoutePoint, RouteSegment>) {
    this._range = new MaxMin();
  }
}

export class SlopeProperty implements ISlope {
  private _useAltitude;

  private _totalLength: number;
  private _totalHeight: number;
  get avg(): number {
    return this._totalHeight ? this._totalLength / this._totalHeight : 0;
  }

  private _uphill: SlopeSigned;
  get uphill(): ISlopeSigned {
    return {
      avg: this._uphill.avg,
      max: this._uphill.max
    }
  }

  private _downhill: SlopeSigned;
  get downhill(): ISlopeSigned {
    return {
      avg: this._downhill.avg,
      max: this._downhill.max
    }
  }

  constructor(useAltitude = false) {
    this._useAltitude = useAltitude;
    this._uphill = new SlopeSigned(this.isAscending);
    this._downhill = new SlopeSigned(this.isDescending);
  }

  fromTo(
    start: VertexNode<RoutePoint, RouteSegment>,
    end: VertexNode<RoutePoint, RouteSegment>
  ): void {
    this._uphill = new SlopeSigned(this.isAscending);
    this._downhill = new SlopeSigned(this.isDescending);

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
    this._totalLength += segment.val.length;
    this._totalHeight += segment.val.height;

    this._uphill.add(segment);
    this._downhill.add(segment);
  }

  remove(segment: SegmentNode<RoutePoint, RouteSegment>) {
    this._totalLength -= segment.val.length;
    this._totalHeight -= segment.val.height;

    this._uphill.remove(segment);
    this._downhill.remove(segment);
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }
}