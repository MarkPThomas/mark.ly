import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry/Polyline";
import {
  BasicProperty,
  MaxMinProperty,
  Sum
} from "../../../../Geometry/Stats";
import { INodeOfInterest } from "../../../../Geometry/Stats/INodeOfInterest";

import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

interface ISlopeSigned {
  avg: number;
  max: INodeOfInterest<RoutePoint, RouteSegment>;
}

export interface ISlope {
  avg: number;
  uphill: ISlopeSigned;
  downhill: ISlopeSigned;
};

class SlopeStatsSigned
  extends BasicProperty<RoutePoint, RouteSegment>
  implements ISlopeSigned {

  private _maxMin: MaxMinProperty<RoutePoint, RouteSegment>;
  private _gain: Sum;
  private _gainLength: Sum;

  get avg(): number {
    return this._gainLength.value ? this._gain.value / this._gainLength.value : 0;
  }

  get max(): INodeOfInterest<RoutePoint, RouteSegment> {
    return this._maxMin?.range.max;
  }

  protected override initializeProperties() {
    this._gain = new Sum(this._isConsidered);
    this._gainLength = new Sum(this._isConsidered);

    this._maxMin = new MaxMinProperty<RoutePoint, RouteSegment>(this.getPtElevation);
  }

  protected getPtElevation(point: RoutePoint): number {
    return point?.elevation;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._gain.add(segment.val.height);
    this._gainLength.add(segment.val.length);

    this._maxMin.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._gain.remove(segment.val.height);
    this._gainLength.remove(segment.val.length);

    this._maxMin.remove(segment);
  }

  serialize(): ISlopeSigned {
    return {
      avg: this.avg,
      max: this.max
    }
  }
}

export class SlopeStats
  extends BasicProperty<RoutePoint, RouteSegment>
  implements ISlope {

  private _totalLength: number;
  private _totalHeight: number;
  get avg(): number {
    return this._totalHeight ? this._totalLength / this._totalHeight : 0;
  }

  private _uphill: SlopeStatsSigned;
  get uphill(): ISlopeSigned {
    return {
      avg: this._uphill.avg,
      max: this._uphill.max
    }
  }

  private _downhill: SlopeStatsSigned;
  get downhill(): ISlopeSigned {
    return {
      avg: this._downhill.avg,
      max: this._downhill.max
    }
  }

  constructor(startVertex?: VertexNode<RoutePoint, RouteSegment>) {
    super(startVertex);
    this.initialize(startVertex);
  }

  protected override initializeProperties() {
    this._uphill = new SlopeStatsSigned(this._startVertex, this.isAscending);
    this._downhill = new SlopeStatsSigned(this._startVertex, this.isDescending);
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }

  protected override addProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength += segment.val.length;
    this._totalHeight += segment.val.height;

    this._uphill.add(segment);
    this._downhill.add(segment);
  }

  protected override removeProperties(segment: SegmentNode<RoutePoint, RouteSegment>) {
    if (!segment) {
      return;
    }

    this._totalLength -= segment.val.length;
    this._totalHeight -= segment.val.height;

    this._uphill.remove(segment);
    this._downhill.remove(segment);
  }

  serialize(): ISlope {
    return {
      avg: this.avg,
      uphill: this._uphill.serialize(),
      downhill: this._downhill.serialize()
    }
  }
}