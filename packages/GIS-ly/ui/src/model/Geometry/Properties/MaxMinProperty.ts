import { Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { BasicProperty } from "./BasicProperty";
import { MaxMin } from "./MaxMin";

export class MaxMinProperty<TVertex extends Vertex, TSegment extends Segment>
  extends BasicProperty<TVertex, TSegment>
{
  protected _tolerance: number;
  protected _getProperty: (val: TVertex | TSegment) => number;

  protected _range: MaxMin<TVertex, TSegment>;
  get range() {
    if (this._range === null) {
      this.lazyLoadRange();
    }
    return this._range;
  }

  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    startVertex?: VertexNode<TVertex, TSegment>,
    tolerance: number = 1e-6,
    isConsidered: (number: number) => boolean | null = null
  ) {
    super(startVertex, isConsidered);

    this._getProperty = getProperty;
    this._tolerance = tolerance;
  }

  protected override initializeProperties() {
    if (this._startVertex) {
      this._range = new MaxMin<TVertex, TSegment>(this._getProperty, this._tolerance, this._isConsidered);
    } else {
      this._range = null;
    }
  }

  protected override addProperties(segment: SegmentNode<TVertex, TSegment>) {
    if (!this._startVertex) {
      this.initialize(segment.prevVert, segment.nextVert);
    }

    this._range.add(segment.prevVert);
    this._range.add(segment.nextVert);
  }

  protected override removeProperties() {
    this._range = null;
  }

  protected lazyLoadRange() {
    this._range = new MaxMin<TVertex, TSegment>(this._getProperty);

    let segNode = this._startVertex.nextSeg;
    while (segNode) {
      this._range.add(segNode);

      if (segNode.nextVert === this._endVertex) {
        break;
      } else {
        segNode = segNode.next as SegmentNode<TVertex, TSegment>;
      }
    }
  }

  override serialize() {
    return {
      max: this._range.max,
      min: this._range.min
    }
  }
}