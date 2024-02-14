import { Polyline, VertexNode } from "@markpthomas/geometry";
import { BasicStats } from "@markpthomas/geometry/stats";

import {
  IRouteStats,
  IRouteStatsCriteria,
  RouteStats
} from "../../Route/Stats/RouteStats";
import { PolylineTrack } from "../PolylineTrack";
import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";
import { HeightRateStats, IHeightRate } from "./HeightRateStats";
import { IRateProperty } from "./IRateProperty";
import { SpeedStats } from "./SpeedStats";
import { ITime, TimeStats } from "./TimeStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface ITrackStatsCriteria
 * @typedef {ITrackStatsCriteria}
 * @extends {IRouteStatsCriteria}
 */
export interface ITrackStatsCriteria extends IRouteStatsCriteria {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {?(number: number) => boolean}
 */
  isSpeedConsidered?: (number: number) => boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {?(number: number) => boolean}
 */
  isHeightRateConsidered?: (number: number) => boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {?(number: number) => boolean}
 */
  isTimeConsidered?: (number: number) => boolean;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface ITrackStats
 * @typedef {ITrackStats}
 * @extends {IRouteStats}
 */
export interface ITrackStats extends IRouteStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {ITime}
 */
  time: ITime;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {IRateProperty}
 */
  speed: IRateProperty;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {IHeightRate}
 */
  heightRate: IHeightRate;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @class TrackStats
 * @typedef {TrackStats}
 * @template {TrackPoint} [TVertex=TrackPoint]
 * @template {TrackSegment} [TSegment=TrackSegment]
 * @template {ITrackStats} [TStats=ITrackStats]
 * @extends {RouteStats<TVertex, TSegment>}
 */
export class TrackStats<
  TVertex extends TrackPoint = TrackPoint,
  TSegment extends TrackSegment = TrackSegment,
  TStats extends ITrackStats = ITrackStats
> extends RouteStats<TVertex, TSegment> {

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @type {ITrackStatsCriteria}
 */
  protected override _isStatConsidered: ITrackStatsCriteria;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @type {SpeedStats}
 */
  protected _speedStats: SpeedStats;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @type {HeightRateStats}
 */
  protected _heightRateStats: HeightRateStats;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @type {TimeStats}
 */
  protected _timeStats: TimeStats;

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {TStats}
 */
  override get stats(): TStats {
    return this.compileStats() as TStats;
  }

  /**
 * Creates an instance of TrackStats.
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @constructor
 * @protected
 * @param {?Polyline<TVertex, TSegment>} [polyline]
 * @param {?ITrackStatsCriteria} [isStatConsidered]
 * @param {?VertexNode<TVertex, TSegment>} [firstVertex]
 * @param {?VertexNode<TVertex, TSegment>} [lastVertex]
 */
  protected constructor(
    polyline?: Polyline<TVertex, TSegment>,
    isStatConsidered?: ITrackStatsCriteria,
    firstVertex?: VertexNode<TVertex, TSegment>,
    lastVertex?: VertexNode<TVertex, TSegment>
  ) {
    super(polyline, isStatConsidered, firstVertex, lastVertex);

    this._isStatConsidered = {
      ...this._isStatConsidered,
      isSpeedConsidered: isStatConsidered?.isSpeedConsidered,
      isHeightRateConsidered: isStatConsidered?.isHeightRateConsidered,
      isTimeConsidered: isStatConsidered?.isTimeConsidered
    }

  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @template {TrackPoint} [TVertex=TrackPoint]
 * @template {TrackSegment} [TSegment=TrackSegment]
 * @param {PolylineTrack} polyline
 * @param {?ITrackStatsCriteria} [isStatConsidered]
 * @returns {TrackStats}
 */
  static fromTrack<
    TVertex extends TrackPoint = TrackPoint,
    TSegment extends TrackSegment = TrackSegment
  >(
    polyline: PolylineTrack,
    isStatConsidered?: ITrackStatsCriteria
  ): TrackStats {
    return new TrackStats(polyline, isStatConsidered);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @template {TrackPoint} [TVertex=TrackPoint]
 * @template {TrackSegment} [TSegment=TrackSegment]
 * @param {VertexNode<TVertex, TSegment>} firstPoint
 * @param {VertexNode<TVertex, TSegment>} lastPoint
 * @param {?ITrackStatsCriteria} [isStatConsidered]
 * @returns {TrackStats}
 */
  static fromTrackPoints<
    TVertex extends TrackPoint = TrackPoint,
    TSegment extends TrackSegment = TrackSegment
  >(
    firstPoint: VertexNode<TVertex, TSegment>,
    lastPoint: VertexNode<TVertex, TSegment>,
    isStatConsidered?: ITrackStatsCriteria
  ): TrackStats {
    return new TrackStats(null, isStatConsidered, firstPoint, lastPoint);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected override initializeAndAddStats() {
    super.initializeAndAddStats();

    this._timeStats = new TimeStats(this._isStatConsidered.isTimeConsidered);
    this.addStatsByState(this._timeStats as unknown as BasicStats<TVertex, TSegment>);

    this._speedStats = new SpeedStats(this._isStatConsidered.isSpeedConsidered);
    this.addStatsByState(this._speedStats as unknown as BasicStats<TVertex, TSegment>);

    this._heightRateStats = new HeightRateStats(this._isStatConsidered.isHeightRateConsidered);
    this.addStatsByState(this._heightRateStats as unknown as BasicStats<TVertex, TSegment>);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 * @returns {TStats}
 */
  protected override serialize(): TStats {
    const baseJson = super.serialize();
    return {
      ...baseJson,
      time: this._timeStats.serialize(),
      speed: this._speedStats.serialize(),
      heightRate: this._heightRateStats.serialize()
    } as TStats;
  }
}