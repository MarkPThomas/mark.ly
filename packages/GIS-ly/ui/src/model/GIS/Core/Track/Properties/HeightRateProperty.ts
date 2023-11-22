import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry";
import {
  IPointOfInterest,
  MaxMin,
  Sum
} from "../../../../Geometry/Properties";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

interface IHeightRateSigned {
  avg: number;
  max: IPointOfInterest;
}

export interface IHeightRate {
  ascent: IHeightRateSigned;
  descent: IHeightRateSigned;
};


class HeightRateSigned implements IHeightRateSigned {
  private _range: MaxMin<VertexNode<TrackPoint, TrackSegment>>;
  private _heightTotal: Sum;
  private _duration: Sum;

  get avg(): number {
    return this._duration.value ? this._heightTotal.value / this._duration.value : 0;
  }

  get max(): IPointOfInterest<VertexNode<TrackPoint, TrackSegment>> {
    return this._range.max;
  }

  constructor(isConsidered: (number: number) => boolean) {
    this._range = new MaxMin<VertexNode<TrackPoint, TrackSegment>>();

    this._heightTotal = new Sum(isConsidered);
    this._duration = new Sum(isConsidered);
  }

  add(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._heightTotal.add(segment.val.height);
    this._duration.add(segment.val.duration);

    this._range.add(segment.prevVert.val.elevation);
    this._range.add(segment.nextVert.val.elevation);
  }

  remove(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._range = new MaxMin();
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }
}

export class HeightRateProperty implements IHeightRate {
  private _useAltitude;

  private _ascent: HeightRateSigned;
  get ascent(): IHeightRateSigned {
    return {
      avg: this._ascent.avg,
      max: this._ascent.max
    }
  }

  private _descent: HeightRateSigned;
  get descent(): IHeightRateSigned {
    return {
      avg: this._descent.avg,
      max: this._descent.max
    }
  }

  constructor(useAltitude = false) {
    this._useAltitude = useAltitude;
    this._ascent = new HeightRateSigned(this.isAscending);
    this._descent = new HeightRateSigned(this.isDescending);
  }

  fromTo(
    start: VertexNode<TrackPoint, TrackSegment>,
    end: VertexNode<TrackPoint, TrackSegment>
  ): void {
    this._ascent = new HeightRateSigned(this.isAscending);
    this._descent = new HeightRateSigned(this.isDescending);

    let segNode = start.nextSeg;
    while (segNode) {
      this.add(segNode);

      if (segNode.nextVert === end) {
        break;
      } else {
        segNode = segNode.next as SegmentNode<TrackPoint, TrackSegment>;
      }
    }
  }

  add(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.add(segment);
    this._descent.add(segment);
  }

  remove(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._ascent.remove(segment);
    this._descent.remove(segment);
  }

  protected isAscending(number: number): boolean {
    return number > 0;
  }

  protected isDescending(number: number): boolean {
    return number < 0;
  }
}