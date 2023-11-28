import { IPolylineStats, PolylineStats } from "../../../../Geometry/Polyline/Stats/PolylineStats";
import { RoutePoint } from "../RoutePoint";
import { RouteSegment } from "../RouteSegment";
import { HeightStats, IHeight } from "./HeightStats";
import { ISlope, SlopeStats } from "./SlopeStats";

export interface IRouteStats extends IPolylineStats {
  height: IHeight;
  slope: ISlope;
}

export class RouteStats<
  TVertex extends RoutePoint = RoutePoint,
  TSegment extends RouteSegment = RouteSegment,
  TStats extends IRouteStats = IRouteStats
>
  extends PolylineStats<TVertex, TSegment> {

  protected _heightStats: HeightStats;
  protected _slopeStats: SlopeStats;

  override addStats() {
    super.addStats();

    this._heightStats = new HeightStats();
    this._heightStats.fromTo(this._firstVertex, this._lastVertex);

    this._slopeStats = new SlopeStats();
    this._slopeStats.fromTo(this._firstVertex, this._lastVertex);
  }

  protected override compileStats(): TStats {
    return {
      ...super.compileStats(),
      height: this._heightStats.serialize(),
      slope: this._slopeStats.serialize()
    } as TStats;
  }
}