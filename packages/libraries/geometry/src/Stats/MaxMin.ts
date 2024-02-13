import { NodeDouble } from "@markpthomas/data-structures";

import { Segment, Vertex } from "../Polyline";
import { INodeOfInterest, NodeOfInterest } from "./INodeOfInterest";
import { ConstrainedStats } from "./ConstrainedStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface IMaxMin
 * @typedef {IMaxMin}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
export interface IMaxMin<TVertex extends Vertex, TSegment extends Segment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  min: INodeOfInterest<TVertex, TSegment>,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  max: INodeOfInterest<TVertex, TSegment>
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @class MaxMin
 * @typedef {MaxMin}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {ConstrainedStats}
 * @implements {IMaxMin<TVertex, TSegment>}
 */
export class MaxMin<TVertex extends Vertex, TSegment extends Segment>
  extends ConstrainedStats
  implements IMaxMin<TVertex, TSegment>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {number}
 */
  protected _tolerance: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(val: TVertex | TSegment) => number}
 */
  protected _getProperty: (val: TVertex | TSegment) => number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _min: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  get min(): INodeOfInterest<TVertex, TSegment> {
    return this._min.value !== MaxMin.minInitial ? this._min : MaxMin.emptyEntry();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _max: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  get max(): INodeOfInterest<TVertex, TSegment> {
    return this._max.value !== MaxMin.maxInitial ? this._max : MaxMin.emptyEntry();
  }

  /**
 * Creates an instance of MaxMin.
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @constructor
 * @param {(val: TVertex | TSegment) => number} getProperty
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 * @param {number} [tolerance=1e-6]
 */
  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isConsidered: ((number: number) => boolean) | null = null,
    tolerance: number = 1e-6
  ) {
    super(isConsidered);

    if (tolerance) {
      this._tolerance = Math.abs(tolerance);
    } else {
      this._tolerance = 1e-6
    }
    this._getProperty = getProperty;

    this.initializeNodesOfInterest();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 */
  protected initializeNodesOfInterest() {
    this._max = MaxMin.emptyEntry();
    this._max.value = MaxMin.maxInitial;

    this._min = MaxMin.emptyEntry();
    this._min.value = MaxMin.minInitial;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {?NodeDouble<TVertex | TSegment>} [node]
 */
  add(node?: NodeDouble<TVertex | TSegment>) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      if (this._min.value === MaxMin.minInitial || number - this._min.value < -this._tolerance) {
        this._min.value = number;
        this._min.nodes = [];
      }

      if (Math.abs(number - this._min.value) <= this._tolerance) {
        this._min.nodes.push(node);
      }

      if (this._max.value === MaxMin.maxInitial || number - this._max.value > this._tolerance) {
        this._max.value = number;
        this._max.nodes = [];
      }

      if (Math.abs(number - this._max.value) <= this._tolerance) {
        this._max.nodes.push(node);
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @static
 * @type {number}
 */
  protected static maxInitial = -Infinity;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @static
 * @type {*}
 */
  protected static minInitial = Infinity;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @static
 * @returns {{ max: { value: number; nodes: {}; \}; min: { value: number; nodes: {\}; \}; \}\}
 */
  static empty() {
    return {
      max: MaxMin.emptyEntry(),
      min: MaxMin.emptyEntry()
    };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @static
 * @returns {{ value: number; nodes: {}; \}\}
 */
  static emptyEntry() {
    return NodeOfInterest.empty();
  }
}