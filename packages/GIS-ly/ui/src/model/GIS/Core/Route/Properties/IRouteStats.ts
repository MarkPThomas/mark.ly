import { IPolylineProperties } from "../../../../Geometry/Polyline/Properties/IPolylineProperties";
import { IHeight } from "./HeightProperty";
import { ISlope } from "./SlopeProperty";

export interface IRouteStats extends IPolylineProperties {
  height: IHeight;
  slope: ISlope;
}