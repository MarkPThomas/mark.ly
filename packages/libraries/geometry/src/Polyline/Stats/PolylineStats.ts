import { BasicStats } from "../../stats/index";
import { Polyline } from "../Polyline";
import { Segment } from "../Segment";
import { Vertex } from "../Vertex";
import { VertexNode } from "../VertexNode";
import { ILength, LengthStats } from "./LengthStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface IPolylineStatsCriteria
 * @typedef {IPolylineStatsCriteria}
 */
export interface IPolylineStatsCriteria {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @type {?(number: number) => boolean}
 */
  isLengthConsidered?: (number: number) => boolean;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @interface IPolylineStats
 * @typedef {IPolylineStats}
 * @extends {ILength}
 */
export interface IPolylineStats extends ILength {
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @class PolylineStats
 * @typedef {PolylineStats}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @template {IPolylineStats} [TStats=IPolylineStats]
 */
export class PolylineStats<
  TVertex extends Vertex,
  TSegment extends Segment,
  TStats extends IPolylineStats = IPolylineStats
> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(Polyline<TVertex, TSegment> | undefined)}
 */
  protected _polyline: Polyline<TVertex, TSegment> | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {number}
 */
  protected _lastPolylineVersion: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {number}
 */
  get polylineVersion(): number {
    return this._lastPolylineVersion;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(VertexNode<TVertex, TSegment> | undefined)}
 */
  protected _firstVertex: VertexNode<TVertex, TSegment> | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {(VertexNode<TVertex, TSegment> | undefined)}
 */
  protected _lastVertex: VertexNode<TVertex, TSegment> | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {IPolylineStatsCriteria}
 */
  protected _isStatConsidered: IPolylineStatsCriteria;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _statsDirty: boolean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @type {LengthStats<TVertex, TSegment>}
 */
  protected _lengthStats: LengthStats<TVertex, TSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @readonly
 * @type {(TStats | undefined)}
 */
  get stats(): TStats | undefined {
    return this.compileStats();
  }

  /**
 * Creates an instance of PolylineStats.
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @constructor
 * @protected
 * @param {?Polyline<TVertex, TSegment>} [polyline]
 * @param {?IPolylineStatsCriteria} [isStatConsidered]
 * @param {?VertexNode<TVertex, TSegment>} [firstVertex]
 * @param {?VertexNode<TVertex, TSegment>} [lastVertex]
 */
  protected constructor(
    polyline?: Polyline<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria,
    firstVertex?: VertexNode<TVertex, TSegment>,
    lastVertex?: VertexNode<TVertex, TSegment>
  ) {
    this._polyline = polyline;

    this._firstVertex = firstVertex;
    this._lastVertex = lastVertex;

    this._isStatConsidered = {
      isLengthConsidered: isStatConsidered?.isLengthConsidered
    };
    this._statsDirty = true;
    this._lastPolylineVersion = -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @static
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @param {Polyline<TVertex, TSegment>} polyline
 * @param {?IPolylineStatsCriteria} [isStatConsidered]
 * @returns {PolylineStats<TVertex, TSegment, IPolylineStats>}
 */
  static fromPolyline<TVertex extends Vertex, TSegment extends Segment>(
    polyline: Polyline<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria
  ): PolylineStats<TVertex, TSegment, IPolylineStats> {
    return new PolylineStats(polyline, isStatConsidered);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @static
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 * @param {VertexNode<TVertex, TSegment>} firstVertex
 * @param {VertexNode<TVertex, TSegment>} lastVertex
 * @param {?IPolylineStatsCriteria} [isStatConsidered]
 * @returns {PolylineStats<TVertex, TSegment, IPolylineStats>}
 */
  static fromVertices<TVertex extends Vertex, TSegment extends Segment>(
    firstVertex: VertexNode<TVertex, TSegment>,
    lastVertex: VertexNode<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria
  ): PolylineStats<TVertex, TSegment, IPolylineStats> {
    return new PolylineStats(undefined, isStatConsidered, firstVertex, lastVertex);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @returns {boolean}
 */
  isDirty(): boolean {
    if (this.hasPolyline()) {
      return this.polylineVersionMismatch();
    } else {
      return this._statsDirty;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected polylineVersionMismatch() {
    return this._lastPolylineVersion !== this._polyline?.version;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 */
  protected matchPolylineVersion() {
    if (this.hasPolyline()) {
      this._lastPolylineVersion = this._polyline?.version ?? 0;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 */
  setDirty() {
    if (!this.hasPolyline()) {
      this._statsDirty = true;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @returns {boolean}
 */
  hasPolyline(): boolean {
    return !!this._polyline;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 */
  addStats() {
    if (this._polyline || this._firstVertex) {
      this.initializeAndAddStats();

      this._statsDirty = false;
      this.matchPolylineVersion();
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 */
  protected initializeAndAddStats() {
    this._lengthStats = new LengthStats(this._isStatConsidered.isLengthConsidered);
    this.addStatsByState(this._lengthStats);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @template {BasicStats<TVertex, TSegment>} TStat
 * @param {TStat} cb
 */
  protected addStatsByState<TStat extends BasicStats<TVertex, TSegment>>(cb: TStat) {
    if (this._polyline) {
      cb.of(this._polyline);
    } else if (this._firstVertex && this._lastVertex) {
      cb.fromTo(this._firstVertex, this._lastVertex);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @returns {(TStats | undefined)}
 */
  protected compileStats(): TStats | undefined {
    if (this.shouldAddState()) {
      this.addStats();
    }

    return this.propertiesAreNotInitialized()
      ? undefined
      : this.serialize();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected shouldAddState(): boolean {
    return (this.isDirty() || this.propertiesAreNotInitialized());
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected propertiesAreNotInitialized(): boolean {
    return !this._lengthStats;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @protected
 * @returns {TStats}
 */
  protected serialize(): TStats {
    return this._lengthStats.serialize() as TStats;
  }
}