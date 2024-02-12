import { Polyline, Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { ConstrainedStats } from "./ConstrainedStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @abstract
 * @class BasicStats
 * @typedef {BasicStats}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {ConstrainedStats}
 */
export abstract class BasicStats<TVertex extends Vertex, TSegment extends Segment> extends ConstrainedStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  protected _firstVertex: VertexNode<TVertex, TSegment> | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(VertexNode<TVertex, TSegment> | null)}
 */
  protected _lastVertex: VertexNode<TVertex, TSegment> | null;

  /**
 * Creates an instance of BasicStats.
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @constructor
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 */
  constructor(isConsidered: ((number: number) => boolean) | null = null) {
    super(isConsidered);
    this.initializeProperties();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @abstract
 */
  protected abstract initializeProperties(): void;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {Polyline<TVertex, TSegment>} polyline
 */
  of(polyline: Polyline<TVertex, TSegment>) {
    if (!polyline || !polyline.firstVertex || !polyline.lastVertex) {
      return;
    }

    this.fromTo(polyline.firstVertex, polyline.lastVertex);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 */
  update() {
    if (!this._firstVertex || !this._lastVertex) {
      return;
    }

    this.fromTo(this._firstVertex, this._lastVertex);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {VertexNode<TVertex, TSegment>} startVertex
 * @param {VertexNode<TVertex, TSegment>} endVertex
 */
  fromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>
  ): void {
    if (!startVertex || !endVertex) {
      return;
    }

    this._firstVertex = startVertex;
    this._lastVertex = endVertex;
    this.initializeProperties();

    let segNode = startVertex.nextSeg as SegmentNode<TVertex, TSegment>;
    if (segNode) {
      this.add(segNode);

      segNode = segNode.next as SegmentNode<TVertex, TSegment>;
      while (segNode) {
        this.add(segNode, true);

        if (segNode.nextVert === endVertex || !segNode.next) {
          break;
        } else {
          segNode = segNode.next as SegmentNode<TVertex, TSegment>;
        }
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {SegmentNode<TVertex, TSegment>} segment
 * @param {boolean} [nextVertOnly=false]
 */
  add(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = false) {
    if (!segment) {
      return;
    }

    if (!this._firstVertex) {
      this._firstVertex = segment.prevVert;
      this.initializeProperties();
    }
    this._lastVertex = segment.nextVert;

    this.addProperties(segment, nextVertOnly);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @abstract
 * @param {SegmentNode<TVertex, TSegment>} segment
 * @param {?boolean} [nextVertOnly]
 */
  protected abstract addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly?: boolean): void;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {SegmentNode<TVertex, TSegment>} segment
 */
  remove(segment: SegmentNode<TVertex, TSegment>) {
    if (!this._firstVertex || !segment) {
      return;
    }

    if (this._firstVertex === segment.prevVert) {
      // Removing start vertex
      if (this._lastVertex === segment.nextVert) {
        this._firstVertex = null;
        this._lastVertex = null;
      } else {
        this._firstVertex = segment.nextVert;
      }
    } else if (this._lastVertex === segment.nextVert) {
      // Removing end vertex
      if (this._firstVertex === segment.prevVert) {
        this._firstVertex = null;
        this._lastVertex = null;
      } else {
        this._lastVertex = segment.prevVert;
      }
    }

    if (this._firstVertex) {
      this.removeProperties(segment);
    } else {
      this.initializeProperties();
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @abstract
 * @param {SegmentNode<TVertex, TSegment>} segment
 */
  protected abstract removeProperties(segment: SegmentNode<TVertex, TSegment>): void;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @abstract
 * @returns {*}
 */
  abstract serialize(): any;
}