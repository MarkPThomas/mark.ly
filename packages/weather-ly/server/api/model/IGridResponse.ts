import { ICoordinate } from "./Coordinate"
import { IGrid } from "./Grid"

export interface IGridResponse extends IGrid {
  "coordinates": ICoordinate[]
}