import { Segment, SegmentNode, Vertex } from "../Polyline/index";
import { BasicStats } from "./BasicStats";
import { MaxMin } from "./MaxMin";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @class MaxMinStats
 * @typedef {MaxMinStats}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {BasicStats<TVertex, TSegment>}
 */
export class MaxMinStats<TVertex extends Vertex, TSegment extends Segment>
  extends BasicStats<TVertex, TSegment>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @type {number}
 */
  protected _tolerance: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @type {(val: TVertex | TSegment) => number}
 */
  protected _getProperty: (val: TVertex | TSegment) => number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _isSegmentProperty: boolean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @type {MaxMin<TVertex, TSegment>}
 */
  protected _range: MaxMin<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @readonly
 * @type {*}
 */
  get range() {
    return this._range ?? MaxMin.empty();
  }

  /**
 * Creates an instance of MaxMinStats.
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @constructor
 * @param {(val: TVertex | TSegment) => number} getProperty
 * @param {boolean} [isSegmentProperty=false]
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 * @param {number} [tolerance=1e-6]
 */
  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isSegmentProperty: boolean = false,
    isConsidered: ((number: number) => boolean) | null = null,
    tolerance: number = 1e-6
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
    this._isSegmentProperty = isSegmentProperty;
    this._tolerance = tolerance;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 */
  protected override initializeProperties() {
    this._range = new MaxMin<TVertex, TSegment>(this._getProperty, this._isConsidered, this._tolerance);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @param {SegmentNode<TVertex, TSegment>} segment
 * @param {boolean} [nextVertOnly=true]
 */
  protected override addProperties(segment: SegmentNode<TVertex, TSegment>, nextVertOnly: boolean = true) {
    if (!segment) {
      return;
    }

    if (this._isSegmentProperty) {
      this._range.add(segment);
    } else {
      if (!nextVertOnly && segment.prevVert) {
        this._range.add(segment.prevVert);
      }
      if (segment.nextVert) {
        this._range.add(segment.nextVert);
      }
    }
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 */
  protected override removeProperties() {
    this._range = new MaxMin<TVertex, TSegment>(this._getProperty, this._isConsidered, this._tolerance);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @returns {*}
 */
  override serialize() {
    return this._range
      ? {
        max: this._range.max,
        min: this._range.min
      }
      : MaxMin.empty();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @static
 * @returns {*}
 */
  static empty() {
    return MaxMin.empty();
  }
}