import { Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { ConstrainedProperty } from "./ConstrainedProperty";

export abstract class BasicProperty<TVertex extends Vertex, TSegment extends Segment> extends ConstrainedProperty {
  protected _startVertex: VertexNode<TVertex, TSegment>;
  protected _endVertex: VertexNode<TVertex, TSegment>;

  constructor(
    startVertex: VertexNode<TVertex, TSegment>,
    isConsidered: (number: number) => boolean | null = null
  ) {
    super(isConsidered);
    this.initialize(startVertex);
  }

  protected initialize(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex?: VertexNode<TVertex, TSegment>
  ) {
    this._startVertex = startVertex;
    this._endVertex = endVertex ? endVertex : startVertex;

    this.initializeProperties();
  }

  protected abstract initializeProperties(): void;

  fromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>
  ): void {
    if (!startVertex || !endVertex) {
      return;
    }

    this.initialize(startVertex);

    let segNode = startVertex.nextSeg;
    while (segNode) {
      this.add(segNode);

      if (segNode.nextVert === endVertex) {
        break;
      } else {
        segNode = segNode.next as SegmentNode<TVertex, TSegment>;
      }
    }
  }

  add(segment: SegmentNode<TVertex, TSegment>) {
    if (!this._startVertex) {
      this._startVertex = segment.prevVert;
      this._endVertex = segment.nextVert;
    }

    this.addProperties(segment);
  }

  protected abstract addProperties(segment: SegmentNode<TVertex, TSegment>): void;

  remove(segment: SegmentNode<TVertex, TSegment>) {
    if (!this._startVertex) {
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
      this.initialize(null);
    }
  }

  protected abstract removeProperties(segment: SegmentNode<TVertex, TSegment>): void;
}