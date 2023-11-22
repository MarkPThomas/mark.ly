import { IRouteStats } from "../../Route/Properties/IRouteStats";
import { IRateProperty } from "./IRateProperty";

export interface ITrackStats extends IRouteStats {
  duration: number;
  speed: IRateProperty;
  heightRate: {
    ascent: IRateProperty;
    descent: IRateProperty;
  }
}