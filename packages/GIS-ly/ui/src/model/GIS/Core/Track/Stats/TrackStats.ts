import { Polyline, VertexNode } from "../../../../Geometry";
import { BasicStats } from "../../../../Geometry/Stats";
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

export interface ITrackStatsCriteria extends IRouteStatsCriteria {
  isSpeedConsidered?: (number: number) => boolean;
  isHeightRateConsidered?: (number: number) => boolean;
  isTimeConsidered?: (number: number) => boolean;
}

export interface ITrackStats extends IRouteStats {
  time: ITime;
  speed: IRateProperty;
  heightRate: IHeightRate;
}

export class TrackStats<
  TVertex extends TrackPoint = TrackPoint,
  TSegment extends TrackSegment = TrackSegment,
  TStats extends ITrackStats = ITrackStats
> extends RouteStats<TVertex, TSegment> {

  protected override _isStatConsidered: ITrackStatsCriteria;
  protected _speedStats: SpeedStats;
  protected _heightRateStats: HeightRateStats;
  protected _timeStats: TimeStats;

  override get stats(): TStats {
    return this.compileStats() as TStats;
  }

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

  static fromTrack<
    TVertex extends TrackPoint = TrackPoint,
    TSegment extends TrackSegment = TrackSegment
  >(
    polyline: PolylineTrack,
    isStatConsidered?: ITrackStatsCriteria
  ): TrackStats {
    return new TrackStats(polyline, isStatConsidered);
  }

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

  protected override initializeAndAddStats() {
    super.initializeAndAddStats();

    this._timeStats = new TimeStats(this._isStatConsidered.isTimeConsidered);
    this.addStatsByState(this._timeStats as unknown as BasicStats<TVertex, TSegment>);

    this._speedStats = new SpeedStats(this._isStatConsidered.isSpeedConsidered);
    this.addStatsByState(this._speedStats as unknown as BasicStats<TVertex, TSegment>);

    this._heightRateStats = new HeightRateStats(this._isStatConsidered.isHeightRateConsidered);
    this.addStatsByState(this._heightRateStats as unknown as BasicStats<TVertex, TSegment>);
  }

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