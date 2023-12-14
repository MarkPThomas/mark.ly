import { Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { BasicStats } from "./BasicStats";
import { MaxMin } from "./MaxMin";

export class MaxMinStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
{
  protected _tolerance: number;
  protected _getProperty: (val: TVertex | TSegment) => number;
  protected _isSegmentProperty: boolean;

  protected _range: MaxMin<TVertex, TSegment> = null;
  get range() {
    return this._range ?? MaxMin.empty();
  }

  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isSegmentProperty: boolean = false,
    isConsidered: (number: number) => boolean | null = null,
    tolerance: number = 1e-6
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
    this._isSegmentProperty = isSegmentProperty;
    this._tolerance = tolerance;
  }

  protected override initializeProperties() {
    if (this._startVertex) {
      this._range = new MaxMin<TVertex, TSegment>(this._getProperty, this._isConsidered, this._tolerance);
    } else {
      this._range = null;
    }
  }

  protected override addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment) {
      return;
    }

    if (this._isSegmentProperty) {
      this._range.add(segment);
    } else {
      if (!nextVertOnly) {
        this._range.add(segment.prevVert);
      }
      this._range.add(segment.nextVert);
    }
  }

  protected override removeProperties() {
    this._range = null;
  }

  override serialize() {
    return this._range
      ? {
        max: this._range.max,
        min: this._range.min
      }
      : MaxMin.empty();
  }

  static empty() {
    return MaxMin.empty();
  }
}