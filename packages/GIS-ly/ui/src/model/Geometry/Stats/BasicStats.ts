import { Polyline, Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { ConstrainedStats } from "./ConstrainedStats";

export abstract class BasicStats<TVertex extends Vertex, TSegment extends Segment> extends ConstrainedStats {
  protected _startVertex: VertexNode<TVertex, TSegment>;
  protected _endVertex: VertexNode<TVertex, TSegment>;

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
    if (!this._startVertex || !this._endVertex) {
      return;
    }

    this.fromTo(this._startVertex, this._endVertex);
  }

  fromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>
  ): void {
    if (!startVertex || !endVertex) {
      return;
    }

    this._startVertex = startVertex;
    this._endVertex = endVertex;
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

    if (!this._startVertex) {
      this._startVertex = segment.prevVert;
      this.initializeProperties();
    }
    this._endVertex = segment.nextVert;

    this.addProperties(segment, nextVertOnly);
  }

  protected abstract addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly?: boolean): void;

  remove(segment: SegmentNode<TVertex, TSegment>) {
    if (!this._startVertex || !segment) {
      return;
    }

    if (this._startVertex === segment.prevVert) {
      // Removing start vertex
      if (this._endVertex === segment.nextVert) {
        this._startVertex = null;
        this._endVertex = null;
      } else {
        this._startVertex = segment.nextVert;
      }
    } else if (this._endVertex === segment.nextVert) {
      // Removing end vertex
      if (this._startVertex === segment.prevVert) {
        this._startVertex = null;
        this._endVertex = null;
      } else {
        this._endVertex = segment.prevVert;
      }
    }

    if (this._startVertex) {
      this.removeProperties(segment);
    } else {
      this.initializeProperties();
    }
  }

  protected abstract removeProperties(segment: SegmentNode<TVertex, TSegment>): void;

  abstract serialize();
}