import { ICloneable } from '@markpthomas/common-libraries/interfaces';

import {
  NodeDouble,
  INodeDouble
} from '@markpthomas/data-structures';

import { SegmentNode } from './SegmentNode';
import { Segment } from './Segment';
import { Vertex } from './Vertex';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @interface IVertexNode
 * @typedef {IVertexNode}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {INodeDouble<TVertex>}
 */
export interface IVertexNode<TVertex extends Vertex, TSegment extends Segment>
  extends INodeDouble<TVertex> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(SegmentNode<TVertex, TSegment> | null)}
 */
  nextSeg: SegmentNode<TVertex, TSegment> | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(SegmentNode<TVertex, TSegment> | null)}
 */
  prevSeg: SegmentNode<TVertex, TSegment> | null;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @class VertexNode
 * @typedef {VertexNode}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {NodeDouble<TVertex>}
 * @implements {IVertexNode<TVertex, TSegment>}
 * @implements {ICloneable<VertexNode<TVertex, TSegment>>}
 */
export class VertexNode<TVertex extends Vertex, TSegment extends Segment>
  extends NodeDouble<TVertex>
  implements
  IVertexNode<TVertex, TSegment>,
  ICloneable<VertexNode<TVertex, TSegment>>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(SegmentNode<TVertex, TSegment> | null)}
 */
  nextSeg: SegmentNode<TVertex, TSegment> | null = null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {(SegmentNode<TVertex, TSegment> | null)}
 */
  prevSeg: SegmentNode<TVertex, TSegment> | null = null;

  /**
 * Creates an instance of VertexNode.
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @constructor
 * @param {TVertex} vertex
 * @param {(SegmentNode<TVertex, TSegment> | null)} [prevSeg=null]
 * @param {(SegmentNode<TVertex, TSegment> | null)} [nextSeg=null]
 */
  constructor(
    vertex: TVertex,
    prevSeg: SegmentNode<TVertex, TSegment> | null = null,
    nextSeg: SegmentNode<TVertex, TSegment> | null = null
  ) {
    super(vertex);
    this.prevSeg = prevSeg;
    this.nextSeg = nextSeg;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @returns {VertexNode<TVertex, TSegment>}
 */
  clone(): VertexNode<TVertex, TSegment> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<TVertex>).clone();
    }

    return new VertexNode<TVertex, TSegment>(val);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @static
 * @param {*} vertex
 * @returns {boolean}
 */
  static isVertexNode(vertex: any) {
    return vertex && (vertex instanceof VertexNode || 'prevSeg' in vertex);
  }
}