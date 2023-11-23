import { IRouteStats, RouteStats } from "../../Route/Stats/RouteStats";
import { TimeStamp } from "../../Time";
import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";
import { HeightRateStats, IHeightRate } from "./HeightRateStats";
import { IRateProperty } from "./IRateProperty";
import { SpeedStats } from "./SpeedStats";

export interface ITrackStats extends IRouteStats {
  duration: number;
  speed: IRateProperty;
  heightRate: IHeightRate;
}

export class TrackStats<
  TVertex extends TrackPoint = TrackPoint,
  TSegment extends TrackSegment = TrackSegment,
  TStats extends ITrackStats = ITrackStats
>
  extends RouteStats<TVertex, TSegment> {
  protected _speedStats: SpeedStats;
  protected _heightRateStats: HeightRateStats;

  getDuration(): number {
    if (!this._firstVertex) {
      return 0;
    }

    return TimeStamp.calcIntervalSec(this._firstVertex.val.timestamp, this._lastVertex.val.timestamp);
  }

  override addStats() {
    super.addStats();

    this._speedStats = new SpeedStats();
    this._speedStats.fromTo(this._firstVertex, this._lastVertex);

    this._heightRateStats = new HeightRateStats();
    this._heightRateStats.fromTo(this._firstVertex, this._lastVertex);
  }

  protected override compileStats(): TStats {
    return {
      ...super.compileStats(),
      duration: this.getDuration(),
      speed: this._speedStats.serialize(),
      heightRate: this._heightRateStats.serialize()
    } as TStats;
  }
}