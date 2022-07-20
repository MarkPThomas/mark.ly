import { ICoordinate } from "./Coordinate";

export interface IPointResponse extends ICoordinate {
  pointId: number;
  name: string;
  gridId: string;
}