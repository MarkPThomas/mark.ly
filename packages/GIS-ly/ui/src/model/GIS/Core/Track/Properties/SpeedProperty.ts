import {
  SegmentNode,
  VertexNode
} from "../../../../Geometry/Polyline";
import {
  IPointOfInterest,
  MaxMin,
  Sum
} from "../../../../Geometry/Properties";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface ISpeed {
  avg: number;
  max: IPointOfInterest;
  min: IPointOfInterest;
}

export class SpeedProperty implements ISpeed {
  _range: MaxMin<SegmentNode<TrackPoint, TrackSegment>>;
  get max(): IPointOfInterest<SegmentNode<TrackPoint, TrackSegment>> {
    return this._range.max;
  }
  get min(): IPointOfInterest<SegmentNode<TrackPoint, TrackSegment>> {
    return this._range.min;
  }

  _distance: Sum;
  _duration: Sum;
  get avg(): number {
    return this._duration ? this._distance.value / this._duration.value : 0;
  }

  private _useAltitude;

  constructor(useAltitude = false) {
    this._useAltitude = useAltitude;

    this._distance = new Sum();
    this._duration = new Sum();
    this._range = new MaxMin<SegmentNode<TrackPoint, TrackSegment>>();
  }

  fromTo(
    start: VertexNode<TrackPoint, TrackSegment>,
    end: VertexNode<TrackPoint, TrackSegment>
  ): void {
    this._distance = new Sum();
    this._duration = new Sum();
    this._range = new MaxMin<SegmentNode<TrackPoint, TrackSegment>>();

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
    this._distance.add(segment.val.height);
    this._duration.add(segment.val.height);

    this._range.add(segment.val.speed);
  }

  remove(segment: SegmentNode<TrackPoint, TrackSegment>) {
    this._distance.add(segment.val.height);
    this._duration.add(segment.val.height);

    this._range = new MaxMin();
  }
}