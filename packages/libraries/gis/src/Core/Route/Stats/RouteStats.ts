import { Polyline, VertexNode } from "@MPT/geometry";
import {
  IPolylineStats,
  IPolylineStatsCriteria,
  PolylineStats
} from "@MPT/geometry/Polyline/Stats/PolylineStats";
import { BasicStats } from "@MPT/geometry/Stats";

import { PolylineRoute } from "../PolylineRoute";
import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";

import { HeightStats, IHeight } from "./HeightStats";
import { ISlope, SlopeStats } from "./SlopeStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface IRouteStatsCriteria
 * @typedef {IRouteStatsCriteria}
 * @extends {IPolylineStatsCriteria}
 */
export interface IRouteStatsCriteria extends IPolylineStatsCriteria {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {?(number: number) => boolean}
 */
  isHeightConsidered?: (number: number) => boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {?(number: number) => boolean}
 */
  isSlopeConsidered?: (number: number) => boolean;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface IRouteStats
 * @typedef {IRouteStats}
 * @extends {IPolylineStats}
 */
export interface IRouteStats extends IPolylineStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {IHeight}
 */
  height: IHeight;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {ISlope}
 */
  slope: ISlope;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @class RouteStats
 * @typedef {RouteStats}
 * @template {RoutePoint} [TVertex=RoutePoint]
 * @template {RouteSegment} [TSegment=RouteSegment]
 * @template {IRouteStats} [TStats=IRouteStats]
 * @extends {PolylineStats<TVertex, TSegment>}
 */
export class RouteStats<
  TVertex extends RoutePoint = RoutePoint,
  TSegment extends RouteSegment = RouteSegment,
  TStats extends IRouteStats = IRouteStats
> extends PolylineStats<TVertex, TSegment> {

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @type {IRouteStatsCriteria}
 */
  protected override _isStatConsidered: IRouteStatsCriteria;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @type {HeightStats}
 */
  protected _heightStats: HeightStats;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @type {SlopeStats}
 */
  protected _slopeStats: SlopeStats;

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @readonly
 * @type {TStats}
 */
  override get stats(): TStats {
    return this.compileStats() as TStats;
  }

  /**
 * Creates an instance of RouteStats.
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @constructor
 * @protected
 * @param {?Polyline<TVertex, TSegment>} [polyline]
 * @param {?IRouteStatsCriteria} [isStatConsidered]
 * @param {?VertexNode<TVertex, TSegment>} [firstVertex]
 * @param {?VertexNode<TVertex, TSegment>} [lastVertex]
 */
  protected constructor(
    polyline?: Polyline<TVertex, TSegment>,
    isStatConsidered?: IRouteStatsCriteria,
    firstVertex?: VertexNode<TVertex, TSegment>,
    lastVertex?: VertexNode<TVertex, TSegment>
  ) {
    super(polyline, isStatConsidered, firstVertex, lastVertex);

    this._isStatConsidered = {
      ...this._isStatConsidered,
      isHeightConsidered: isStatConsidered?.isHeightConsidered,
      isSlopeConsidered: isStatConsidered?.isSlopeConsidered
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @template {RoutePoint} [TVertex=RoutePoint]
 * @template {RouteSegment} [TSegment=RouteSegment]
 * @param {PolylineRoute<TVertex, TSegment>} polyline
 * @param {?IRouteStatsCriteria} [isStatConsidered]
 * @returns {RouteStats<TVertex, TSegment, IRouteStats>}
 */
  static fromRoute<
    TVertex extends RoutePoint = RoutePoint,
    TSegment extends RouteSegment = RouteSegment
  >(
    polyline: PolylineRoute<TVertex, TSegment>,
    isStatConsidered?: IRouteStatsCriteria
  ): RouteStats<TVertex, TSegment, IRouteStats> {
    return new RouteStats<TVertex, TSegment, IRouteStats>(polyline, isStatConsidered);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @template {RoutePoint} [TVertex=RoutePoint]
 * @template {RouteSegment} [TSegment=RouteSegment]
 * @param {VertexNode<TVertex, TSegment>} firstPoint
 * @param {VertexNode<TVertex, TSegment>} lastPoint
 * @param {?IRouteStatsCriteria} [isStatConsidered]
 * @returns {RouteStats<TVertex, TSegment, IRouteStats>}
 */
  static fromRoutePoints<
    TVertex extends RoutePoint = RoutePoint,
    TSegment extends RouteSegment = RouteSegment
  >(
    firstPoint: VertexNode<TVertex, TSegment>,
    lastPoint: VertexNode<TVertex, TSegment>,
    isStatConsidered?: IRouteStatsCriteria
  ): RouteStats<TVertex, TSegment, IRouteStats> {
    return new RouteStats<TVertex, TSegment, IRouteStats>(null, isStatConsidered, firstPoint, lastPoint);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 */
  protected override initializeAndAddStats() {
    super.initializeAndAddStats();

    this._heightStats = new HeightStats(this._isStatConsidered.isHeightConsidered);
    this.addStatsByState(this._heightStats as unknown as BasicStats<TVertex, TSegment>);

    this._slopeStats = new SlopeStats(this._isStatConsidered.isSlopeConsidered);
    this.addStatsByState(this._slopeStats as unknown as BasicStats<TVertex, TSegment>);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected override propertiesAreNotInitialized(): boolean {
    return super.propertiesAreNotInitialized() || !this._heightStats || !this._slopeStats;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @returns {TStats}
 */
  protected override serialize() {
    const baseJson = super.serialize();
    return {
      ...baseJson,
      height: this._heightStats.serialize(),
      slope: this._slopeStats.serialize()
    } as TStats;
  }
}