import { ICloneable } from 'common/interfaces';

import {
  NodeDouble,
  INodeDouble
} from '@markpthomas/data-structures';

import { VertexNode } from './VertexNode';
import { Segment } from './Segment';
import { Vertex } from './Vertex';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @interface ISegmentNode
 * @typedef {ISegmentNode}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {INodeDouble<TSegment>}
 */
export interface ISegmentNode<TVertex extends Vertex, TSegment extends Segment>
  extends INodeDouble<TSegment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  nextVert: VertexNode<TVertex, TSegment> | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  prevVert: VertexNode<TVertex, TSegment> | null;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @class SegmentNode
 * @typedef {SegmentNode}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {NodeDouble<TSegment>}
 * @implements {ISegmentNode<TVertex, TSegment>}
 * @implements {ICloneable<SegmentNode<TVertex, TSegment>>}
 */
export class SegmentNode<TVertex extends Vertex, TSegment extends Segment>
  extends NodeDouble<TSegment>
  implements
  ISegmentNode<TVertex, TSegment>,
  ICloneable<SegmentNode<TVertex, TSegment>>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  nextVert: VertexNode<TVertex, TSegment> | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  prevVert: VertexNode<TVertex, TSegment> | null;


  /**
 * Creates an instance of SegmentNode.
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @constructor
 * @param {?VertexNode<TVertex, TSegment>} [prevCoord]
 * @param {?VertexNode<TVertex, TSegment>} [nextCoord]
 * @param {?TSegment} [segment]
 */
  constructor(
    prevCoord?: VertexNode<TVertex, TSegment>,
    nextCoord?: VertexNode<TVertex, TSegment>,
    segment?: TSegment
  ) {
    super(segment ?? null);
    this.prevVert = prevCoord ?? null;
    this.nextVert = nextCoord ?? null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @returns {SegmentNode<TVertex, TSegment>}
 */
  clone(): SegmentNode<TVertex, TSegment> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<TSegment>).clone();
    }

    return new SegmentNode<TVertex, TSegment>(null, null, val);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @static
 * @param {*} segment
 * @returns {boolean}
 */
  static isSegmentNode(segment: any) {
    return segment instanceof SegmentNode || 'prevVert' in segment;
  }
}