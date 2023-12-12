import { Polyline, Vertex, VertexNode } from "../../../../Geometry";
import {
  IPolylineStats,
  IPolylineStatsCriteria,
  PolylineStats
} from "../../../../Geometry/Polyline/Stats/PolylineStats";
import { BasicStats } from "../../../../Geometry/Stats";
import { PolylineRoute } from "../PolylineRoute";
import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";
import { HeightStats, IHeight } from "./HeightStats";
import { ISlope, SlopeStats } from "./SlopeStats";

export interface IRouteStatsCriteria extends IPolylineStatsCriteria {
  isHeightConsidered?: (number: number) => boolean;
  isSlopeConsidered?: (number: number) => boolean;
}

export interface IRouteStats extends IPolylineStats {
  height: IHeight;
  slope: ISlope;
}

export class RouteStats<
  TVertex extends RoutePoint = RoutePoint,
  TSegment extends RouteSegment = RouteSegment,
  TStats extends IRouteStats = IRouteStats
> extends PolylineStats<TVertex, TSegment> {

  protected override _isStatConsidered: IRouteStatsCriteria;
  protected _heightStats: HeightStats;
  protected _slopeStats: SlopeStats;

  override get stats(): TStats {
    return this.compileStats() as TStats;
  }

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

  static fromRoute<
    TVertex extends RoutePoint = RoutePoint,
    TSegment extends RouteSegment = RouteSegment
  >(
    polyline: PolylineRoute<TVertex, TSegment>,
    isStatConsidered?: IRouteStatsCriteria
  ): RouteStats<TVertex, TSegment, IRouteStats> {
    return new RouteStats<TVertex, TSegment, IRouteStats>(polyline, isStatConsidered);
  }

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

  protected override initializeAndAddStats() {
    super.initializeAndAddStats();

    this._heightStats = new HeightStats(this._isStatConsidered.isHeightConsidered);
    this.addStatsByState(this._heightStats as unknown as BasicStats<TVertex, TSegment>);

    this._slopeStats = new SlopeStats(this._isStatConsidered.isSlopeConsidered);
    this.addStatsByState(this._slopeStats as unknown as BasicStats<TVertex, TSegment>);
  }

  // protected override compileStats(): TStats {
  //   return this.propertiesAreNotInitialized()
  //     ? undefined
  //     : {
  //       ...super.compileStats(),
  //       height: this._heightStats.serialize(),
  //       slope: this._slopeStats.serialize()
  //     } as TStats;
  // }

  protected override propertiesAreNotInitialized(): boolean {
    return super.propertiesAreNotInitialized() || !this._heightStats || !this._slopeStats;
  }

  protected override serialize() {
    const baseJson = super.serialize();
    return {
      ...baseJson,
      height: this._heightStats.serialize(),
      slope: this._slopeStats.serialize()
    } as TStats;
  }
}