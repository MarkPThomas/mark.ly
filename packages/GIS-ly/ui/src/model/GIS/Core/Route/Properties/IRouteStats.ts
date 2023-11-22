import { IPolylineProperties } from "../../../../Geometry/IPolylineProperties";
import { IHeight } from "./HeightProperty";
import { ISlope } from "./SlopeProperty";

export interface IRouteStats extends IPolylineProperties {
  height: IHeight;
  slope: ISlope;
}