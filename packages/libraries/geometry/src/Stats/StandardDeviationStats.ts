import { Polyline, Segment, SegmentNode, Vertex, VertexNode } from "../Polyline";
import { BasicStats } from "./BasicStats";
import { SumMean } from "./SumMean";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface IStandardDeviationStats
 * @typedef {IStandardDeviationStats}
 */
export interface IStandardDeviationStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {number}
 */
  sigma: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {number}
 */
  variance: number;
  // confidenceInterval ?
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @class StandardDeviationStats
 * @typedef {StandardDeviationStats}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {BasicStats<TVertex, TSegment>}
 * @implements {IStandardDeviationStats}
 */
export class StandardDeviationStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
  implements IStandardDeviationStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {(val: TVertex | TSegment) => number}
 */
  private _getProperty: (val: TVertex | TSegment) => number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _isSegmentProperty: boolean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {SumMean}
 */
  private _set: SumMean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {boolean}
 */
  private _isDirty: boolean = false;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {number}
 */
  private _windowSize: number = 0;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {number}
 */
  private _variance: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {number}
 */
  get variance(): number {
    return this._isDirty ? this.calculate() : this._variance;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {number}
 */
  get sigma(): number {
    return this._isDirty ? Math.sqrt(this.calculate()) : Math.sqrt(this._variance);
  }


  /**
 * Creates an instance of StandardDeviationStats.
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @constructor
 * @param {(val: TVertex | TSegment) => number} getProperty
 * @param {boolean} [isSegmentProperty=false]
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 */
  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isSegmentProperty: boolean = false,
    isConsidered: ((number: number) => boolean) | null = null,
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
    this._isSegmentProperty = isSegmentProperty;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {number} [windowSize=0]
 * @param {(VertexNode<TVertex, TSegment> | null)} [startVertex=null]
 * @returns {(number | undefined)}
 */
  calculate(
    windowSize: number = 0,
    startVertex: VertexNode<TVertex, TSegment> | null = null
  ): number | undefined {
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {number} [windowSize=0]
 * @param {(VertexNode<TVertex, TSegment> | null)} [node=this._firstVertex]
 */
  private createSet(
    windowSize: number = 0,
    node: VertexNode<TVertex, TSegment> | null = this._firstVertex
  ) {
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


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {boolean} [forward=true]
 * @param {number} [windowSize=0]
 * @returns {number}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {VertexNode<TVertex, TSegment>} node
 * @param {number} offset
 * @returns {VertexNode<TVertex, TSegment>}
 */
  private getOffsetVertex(node: VertexNode<TVertex, TSegment>, offset: number) {
    let currentOffset = 0;
    while (node && currentOffset < offset) {
      node = node.next as VertexNode<TVertex, TSegment>;
      currentOffset++;
    }

    return node;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {number} outVariance
 * @param {number} outVal
 * @param {number} inVal
 * @returns {number}
 */
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


  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    // initialization occurs lazily
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @param {SegmentNode<TVertex, TSegment>} segment
 * @param {boolean} [nextVertOnly=true]
 */
  protected override addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment || (this._isConsidered && !this._isConsidered(this._getProperty(segment.val)))) {
      return;
    }

    if (this._isSegmentProperty) {
      this.addSegNode(segment);
    } else {
      if (!nextVertOnly && segment.prevVert) {
        this.addVertNode(segment.prevVert);
      }
      if (segment.nextVert) {
        this.addVertNode(segment.nextVert);
      }
    }

    this._isDirty = true;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @param {SegmentNode<TVertex, TSegment>} segment
 * @param {boolean} [nextVertOnly=true]
 */
  protected override removeProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment || (this._isConsidered && !this._isConsidered(this._getProperty(segment.val)))) {
      return;
    }

    if (this._isSegmentProperty) {
      this.removeSegNode(segment);
    } else {
      if (!nextVertOnly && segment.prevVert) {
        this.removeVertNode(segment.prevVert);
      }
      if (segment.nextVert) {
        this.removeVertNode(segment.nextVert);
      }
    }

    this._isDirty = true;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {SegmentNode<TVertex, TSegment>} node
 */
  private addSegNode(node: SegmentNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropBySegment(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.add(currProp);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {SegmentNode<TVertex, TSegment>} node
 */
  private removeSegNode(node: SegmentNode<TVertex, TSegment>) {
    const currProp = this.getCurrPropBySegment(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.remove(currProp);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {SegmentNode<TVertex, TSegment>} node
 * @returns {(number | null)}
 */
  private getCurrPropBySegment(node: SegmentNode<TVertex, TSegment>): number | null {
    const currVal = this.getCurrValueBySegment(node);

    return currVal ? this._getProperty(currVal) : null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {SegmentNode<TVertex, TSegment>} node
 * @returns {(TVertex | TSegment)}
 */
  private getCurrValueBySegment(node: SegmentNode<TVertex, TSegment>): TVertex | TSegment {
    return node.val;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {VertexNode<TVertex, TSegment>} node
 */
  private addVertNode(node: VertexNode<TVertex, TSegment>) {
    if (!node) {
      return
    }

    const currProp = this.getCurrPropByVertex(node);
    if (currProp !== null && currProp !== undefined) {
      if (!this._set) {
        this._set = new SumMean();
      }
      this._set.add(currProp);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {VertexNode<TVertex, TSegment>} node
 */
  private removeVertNode(node: VertexNode<TVertex, TSegment>) {
    if (!node) {
      return
    }

    const currProp = this.getCurrPropByVertex(node);
    if (currProp !== null && currProp !== undefined) {
      this._set.remove(currProp);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {VertexNode<TVertex, TSegment>} node
 * @returns {(number | null)}
 */
  private getCurrPropByVertex(node: VertexNode<TVertex, TSegment>): number | null {
    const currVal = this.getCurrValueByVertex(node);

    return currVal ? this._getProperty(currVal) : null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @param {VertexNode<TVertex, TSegment>} node
 * @returns {(TVertex | TSegment | null)}
 */
  private getCurrValueByVertex(node: VertexNode<TVertex, TSegment>): TVertex | TSegment | null {
    if (this._isSegmentProperty) {
      return node !== this._lastVertex ? node.nextSeg?.val ?? null : null;
    } else {
      return node.val;
    }
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 */
  override update() {
    if (!this._firstVertex || !this._lastVertex) {
      return;
    }

    this._set = new SumMean();

    super.update();
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @returns {{ sigma: number; variance: number; }\}
 */
  override serialize() {
    return {
      sigma: this.sigma,
      variance: this.variance
    }
  }
}