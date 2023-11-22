import {
  BasicProperty,
  Sum
} from "../../Properties";

import {
  SegmentNode
} from "../Polyline";
import { Segment } from "../Segment";
import { Vertex } from "../Vertex";

export interface ILength {
  length: number
}

export class LengthProperty<TVertex extends Vertex, TSegment extends Segment>
  extends BasicProperty<TVertex, TSegment>
  implements ILength {

  private _length: Sum;
  get length(): number {
    return this._length.value;
  }

  protected override initializeProperties() {
    this._length = new Sum();
  }

  protected override addProperties(segment: SegmentNode<TVertex, TSegment>) {
    this._length.add(segment.val.length);
  }

  protected override removeProperties(segment: SegmentNode<TVertex, TSegment>) {
    this._length.remove(segment.val.length);
  }
}