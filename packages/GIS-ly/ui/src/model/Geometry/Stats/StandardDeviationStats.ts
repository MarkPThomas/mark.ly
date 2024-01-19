import { Polyline, Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { BasicStats } from "./BasicStats";
import { SumMean } from "./SumMean";

export interface IStandardDeviationStats {
  sigma: number;
  variance: number;
  // confidenceInterval ?
}

export class StandardDeviationStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
  implements IStandardDeviationStats {
  private _getProperty: (val: TVertex | TSegment) => number;
  protected _isSegmentProperty: boolean;

  private _set: SumMean;

  private _isDirty: boolean = false;
  private _windowSize: number = 0;

  private _variance: number = 0;
  get variance(): number {
    return this._isDirty ? this.calculate() : this._variance;
  }

  get sigma(): number {
    return this._isDirty ? Math.sqrt(this.calculate()) : Math.sqrt(this._variance);
  }


  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isSegmentProperty: boolean = false,
    isConsidered: (number: number) => boolean | null = null,
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
    this._isSegmentProperty = isSegmentProperty;
  }


  calculate(windowSize: number = 0, startVertex: VertexNode<TVertex, TSegment> = null) {
    if (!this._firstVertex || windowSize < 0) {
      return;
    }

    if (this._windowSize !== windowSize || startVertex) {
      startVertex = startVertex ?? this._firstVertex;
      const offsetVertex = this.getOffsetVertex(startVertex, windowSize - 1);
      if (!offsetVertex) {
        return;
      }

      if (startVertex) {
        this._firstVertex = startVertex;
      }
      this._lastVertex = offsetVertex;
      this.createSet(windowSize);
      this._windowSize = windowSize;
    }

    this._variance = 0;
    this._isDirty = false;

    const varianceSet = new SumMean();

    let currentCount = 0;
    let node = this._firstVertex;
    while (node && (!windowSize || currentCount < windowSize)) {
      const currItem = this.getCurrPropByVertex(node);
      if (currItem !== null && currItem !== undefined) {
        const currVarianceItem = (currItem - this._set.mean()) ** 2;

        varianceSet.add(currVarianceItem);

        currentCount++;
      }

      if (node === this._lastVertex) {
        break;
      } else {
        node = node.next as VertexNode<TVertex, TSegment>;
      }
    }

    this._variance = this._set.count ? varianceSet.value / this._set.count : 0;

    return this._variance;
  }

  private createSet(windowSize: number = 0, node: VertexNode<TVertex, TSegment> = this._firstVertex) {
    this._set = new SumMean();

    let currentCount = 0;
    while (node && (!windowSize || currentCount < windowSize)) {
      const currProp = this.getCurrPropByVertex(node);
      if (currProp !== null && currProp !== undefined) {
        this._set.add(currProp);
      }

      currentCount++;
      if (node === this._lastVertex) {
        break;
      } else {
        node = node.next as VertexNode<TVertex, TSegment>;
      }
    }
  }


  slideWindow(forward: boolean = true, windowSize: number = 0) {
    if (!this._firstVertex || windowSize < 0) {
      return;
    }

    if (this._isDirty
      || (windowSize && windowSize !== this._windowSize)) {

      return this.calculate(windowSize);
    } else {
      let outVertex: VertexNode<TVertex, TSegment>;
      let inVertex: VertexNode<TVertex, TSegment>;

      if (forward) {
        outVertex = this._firstVertex;
        this._firstVertex = this._firstVertex.next as VertexNode<TVertex, TSegment>;

        inVertex = this.getOffsetVertex(this._firstVertex, this._windowSize - 1);
        this._lastVertex = inVertex;
      } else {
        outVertex = this.getOffsetVertex(this._firstVertex, this._windowSize - 1);
        this._lastVertex = outVertex.prev as VertexNode<TVertex, TSegment>;

        inVertex = this._firstVertex.prev as VertexNode<TVertex, TSegment>;
        this._firstVertex = inVertex;
      }

      if (!inVertex) {
        return null;
      }

      const outVal = this._getProperty(outVertex.val);
      const inVal = this._getProperty(inVertex.val);

      return this.slideVarianceWindow(this._variance, outVal, inVal);
    }
  }

  private getOffsetVertex(node: VertexNode<TVertex, TSegment>, offset: number) {
    let currentOffset = 0;
    while (node && currentOffset < offset) {
      node = node.next as VertexNode<TVertex, TSegment>;
      currentOffset++;
    }

    return node;
  }

  private slideVarianceWindow(outVariance: number, outVal: number, inVal: number) {
    const outMean = this._set.mean();

    this._set.remove(outVal);
    this._set.add(inVal);
    const inMean = this._set.mean();

    const newVariance = this._set.count > 1
      ? outVariance + ((inVal - inMean) ** 2 - (outVal - outMean) ** 2) / (this._set.count - 1)
      : 0;

    this._variance = newVariance;

    return this._variance;
  }


  protected override initializeProperties() {
    // initialization occurs lazily
  }

  protected override addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment || (this._isConsidered && !this._isConsidered(this._getProperty(segment.val)))) {
      return;
    }

    if (this._isSegmentProperty) {
      this.addSegNode(segment);
    } else {
      if (!nextVertOnly) {
        this.addVertNode(segment.prevVert);
      }
      this.addVertNode(segment.nextVert);
    }

    this._isDirty = true;
  }

  protected override removeProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment || (this._isConsidered && !this._isConsidered(this._getProperty(segment.val)))) {
      return;
    }

    if (this._isSegmentProperty) {
      this.removeSegNode(segment);
    } else {
      if (!nextVertOnly) {
        this.removeVertNode(segment.prevVert);
      }
      this.removeVertNode(segment.nextVert);
    }

    this._isDirty = true;
  }


  private addSegNode(node: SegmentNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropBySegment(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.add(currProp);
    }
  }

  private removeSegNode(node: SegmentNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropBySegment(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.remove(currProp);
    }
  }

  private getCurrPropBySegment(node: SegmentNode<TVertex, TSegment>): number {
    const currVal = this.getCurrValueBySegment(node);

    return currVal ? this._getProperty(currVal) : null;
  }

  private getCurrValueBySegment(node: SegmentNode<TVertex, TSegment>): TVertex | TSegment {
    return node.val;
  }


  private addVertNode(node: VertexNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropByVertex(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.add(currProp);
    }
  }

  private removeVertNode(node: VertexNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropByVertex(node);
    if (currProp !== null && currProp !== undefined) {
      this._set.remove(currProp);
    }
  }

  private getCurrPropByVertex(node: VertexNode<TVertex, TSegment>): number {
    const currVal = this.getCurrValueByVertex(node);

    return currVal ? this._getProperty(currVal) : null;
  }

  private getCurrValueByVertex(node: VertexNode<TVertex, TSegment>): TVertex | TSegment {
    if (this._isSegmentProperty) {
      return node !== this._lastVertex ? node.nextSeg?.val : null;
    } else {
      return node.val;
    }
  }

  override update() {
    if (!this._firstVertex || !this._lastVertex) {
      return;
    }

    this._set = null;

    super.update();
  }

  override serialize() {
    return {
      sigma: this.sigma,
      variance: this.variance
    }
  }
}