import { ICoordinate } from "./Coordinate";

export interface IPointResponse extends ICoordinate {
  pointId: string;
  name: string;
  gridId: string;
}