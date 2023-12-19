import { Polyline, Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { ConstrainedStats } from "./ConstrainedStats";

export abstract class BasicStats<TVertex extends Vertex, TSegment extends Segment> extends ConstrainedStats {
  protected _firstVertex: VertexNode<TVertex, TSegment>;
  protected _lastVertex: VertexNode<TVertex, TSegment>;

  constructor(isConsidered: (number: number) => boolean | null = null) {
    super(isConsidered);
    this.initializeProperties();
  }

  protected abstract initializeProperties(): void;

  of(polyline: Polyline<TVertex, TSegment>) {
    if (!polyline || !polyline.firstVertex) {
      return;
    }

    this.fromTo(polyline.firstVertex, polyline.lastVertex);
  }

  update() {
    if (!this._firstVertex || !this._lastVertex) {
      return;
    }

    this.fromTo(this._firstVertex, this._lastVertex);
  }

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

  protected abstract addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly?: boolean): void;

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

  protected abstract removeProperties(segment: SegmentNode<TVertex, TSegment>): void;

  abstract serialize();
}