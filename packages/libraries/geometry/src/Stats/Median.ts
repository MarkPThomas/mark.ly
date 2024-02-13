import { NodeDouble } from "@markpthomas/data-structures";

import { Segment, Vertex } from "../Polyline";
import { INodeOfInterest } from "./INodeOfInterest";
import { ConstrainedStats } from "./ConstrainedStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface IMedian
 * @typedef {IMedian}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
export interface IMedian<TVertex extends Vertex, TSegment extends Segment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  median: INodeOfInterest<TVertex, TSegment>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {number}
 */
  count: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @class Median
 * @typedef {Median}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @extends {ConstrainedStats}
 * @implements {IMedian<TVertex, TSegment>}
 */
export class Median<TVertex extends Vertex, TSegment extends Segment>
  extends ConstrainedStats
  implements IMedian<TVertex, TSegment>
{
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
 * @readonly
 * @type {number}
 */
  get count(): number {
    return this._items.size;
  }

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
 * @type {Map<NodeDouble<TVertex | TSegment>, number>}
 */
  private _items: Map<NodeDouble<TVertex | TSegment>, number> = new Map<NodeDouble<TVertex | TSegment>, number>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _median: INodeOfInterest<TVertex, TSegment> = Median.emptyEntry();
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  get median(): INodeOfInterest<TVertex, TSegment> {
    return this._isDirty ? this.calculate() : this._median;
  }


  /**
 * Creates an instance of Median.
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @constructor
 * @param {(val: TVertex | TSegment) => number} getProperty
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 */
  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isConsidered: ((number: number) => boolean) | null = null
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {NodeDouble<TVertex | TSegment>} node
 */
  add(node: NodeDouble<TVertex | TSegment>) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      this._items.set(node, number);

      if (!this._isDirty) {
        this._isDirty = true;
        this._median = Median.emptyEntry();
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @param {NodeDouble<TVertex | TSegment>} node
 */
  remove(node: NodeDouble<TVertex | TSegment>) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      this._items.delete(node);

      if (!this._isDirty) {
        this._isDirty = true;
        this._median = Median.emptyEntry();
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @returns {INodeOfInterest<TVertex, TSegment>}
 */
  calculate() {
    const items = [...this._items].map(([node, value]) => ({ node, value }));
    items.sort((a, b) => a.value - b.value);

    this._median.nodes = [];
    this._median.value = 0;
    this._isDirty = false;

    const count = this._items.size;
    if (count) {
      if (count === 1) {
        this._median.nodes.push(items[0].node);
        this._median.value = items[0].value;
      } else {
        const halfIndexFloor = Math.floor(count / 2);
        if (count % 2 === 0) {
          const medianItemPre = items[halfIndexFloor - 1];
          const medianItemPost = items[halfIndexFloor];

          this._median.nodes.push(medianItemPre.node, medianItemPost.node);
          this._median.value = 0.5 * (medianItemPre.value + medianItemPost.value);
        } else {
          const medianItem = items[halfIndexFloor];

          this._median.nodes.push(medianItem.node);
          this._median.value = medianItem.value;
        }
      }
    }

    return this._median;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @static
 * @returns {{ count: number; value: { value: number; nodes: {}; \}; \}\}
 */
  static empty() {
    return {
      count: 0,
      value: Median.emptyEntry()
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
    return {
      value: 0,
      nodes: []
    };
  }
}