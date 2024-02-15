import {
  BasicStats,
  Sum
} from "../../stats/index";

import { Segment } from "../Segment";
import { SegmentNode } from "../SegmentNode";
import { Vertex } from "../Vertex";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface ILength
 * @typedef {ILength}
 */
export interface ILength {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {number}
 */
  length: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @class LengthStats
 * @typedef {LengthStats}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {BasicStats<TVertex, TSegment>}
 * @implements {ILength}
 */
export class LengthStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
  implements ILength {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {Sum}
 */
  private _length: Sum;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {number}
 */
  get length(): number {
    return this._length.value;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._length = new Sum();
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @param {SegmentNode<TVertex, TSegment>} segment
 */
  protected override addProperties(segment: SegmentNode<TVertex, TSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.length))) {
      return;
    }

    this._length.add(segment.val.length);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @param {SegmentNode<TVertex, TSegment>} segment
 */
  protected override removeProperties(segment: SegmentNode<TVertex, TSegment>) {
    if (!segment || (this._isConsidered && !this._isConsidered(segment.val.length))) {
      return;
    }

    this._length.remove(segment.val.length);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @returns {ILength}
 */
  override serialize(): ILength {
    return {
      length: this.length ?? 0
    }
  }
}