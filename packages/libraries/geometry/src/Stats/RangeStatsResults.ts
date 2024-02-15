import { INodeOfInterest } from "./index";
import { Vertex, Segment } from "../Polyline/index";
import { NodeOfInterest } from "./INodeOfInterest";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @interface IRangeStatsResults
 * @typedef {IRangeStatsResults}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
export interface IRangeStatsResults<
  TVertex extends Vertex,
  TSegment extends Segment
> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  min: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?number}
 */
  stdMin2?: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?number}
 */
  stdMin1?: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {number}
 */
  avg: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?INodeOfInterest<TVertex, TSegment>}
 */
  mdn?: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?number}
 */
  stdMax1?: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?number}
 */
  stdMax2?: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  max: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {?number}
 */
  std?: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @typedef {RangeStatsResultsProps}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
type RangeStatsResultsProps<
  TVertex extends Vertex,
  TSegment extends Segment
> = {
  avg?: number,
  min?: INodeOfInterest<TVertex, TSegment>,
  max?: INodeOfInterest<TVertex, TSegment>,
  mdn?: INodeOfInterest<TVertex, TSegment>,
  std?: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @class RangeStatsResults
 * @typedef {RangeStatsResults}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
export class RangeStatsResults<
  TVertex extends Vertex,
  TSegment extends Segment
> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {number}
 */
  private _avg: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _min: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _max: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {INodeOfInterest<TVertex, TSegment>}
 */
  private _mdn: INodeOfInterest<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {number}
 */
  private _std: number;

  /**
 * Creates an instance of RangeStatsResults.
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @constructor
 * @param {RangeStatsResultsProps<TVertex, TSegment>} props
 */
  constructor(props: RangeStatsResultsProps<TVertex, TSegment>) {
    this._avg = props.avg ?? 0;
    this._min = props.min ?? NodeOfInterest.empty();
    this._max = props.max ?? NodeOfInterest.empty();
    this._mdn = props.mdn ?? NodeOfInterest.empty();
    this._std = props.std ?? 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @static
 * @returns {{ value: number; nodes: {}; \}\}
 */
  protected static emptyINodeOfInterest() {
    return { value: 0, nodes: [] };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @returns {IRangeStatsResults<TVertex, TSegment>}
 */
  serialize(): IRangeStatsResults<TVertex, TSegment> {
    const statsBase = {
      min: this._min,
      avg: this._avg,
      max: this._max
    };

    let mdnStats = this._mdn.nodes.length ? {
      mdn: this._mdn
    } : {};

    let stdStats = this._std ? {
      stdMin1: this._avg - this._std,
      stdMax1: this._avg + this._std,
      stdMin2: this._avg - 2 * this._std,
      stdMax2: this._avg + 2 * this._std,
      std: this._std
    } : {};

    return {
      ...statsBase,
      ...stdStats,
      ...mdnStats
    };
  }
}