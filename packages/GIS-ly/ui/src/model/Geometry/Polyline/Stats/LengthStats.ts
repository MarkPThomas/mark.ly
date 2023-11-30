import {
  BasicStats,
  Sum
} from "../../Stats";

import {
  SegmentNode
} from "../Polyline";
import { Segment } from "../Segment";
import { Vertex } from "../Vertex";

export interface ILength {
  length: number
}

export class LengthStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
  implements ILength {

  private _length: Sum;
  get length(): number {
    return this._length.value;
  }

  protected override initializeProperties() {
    this._length = new Sum(this._isConsidered);
  }

  protected override addProperties(segment: SegmentNode<TVertex, TSegment>) {
    if (!segment) {
      return;
    }

    this._length.add(segment.val.length);
  }

  protected override removeProperties(segment: SegmentNode<TVertex, TSegment>) {
    if (!segment) {
      return;
    }

    this._length.remove(segment.val.length);
  }

  override serialize(): ILength {
    return {
      length: this.length ?? 0
    }
  }
}