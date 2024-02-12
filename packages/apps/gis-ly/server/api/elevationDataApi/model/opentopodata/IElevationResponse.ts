import { IResponse } from "common/utils/api/Request";
import { ICoordinate } from "./ICoordinate";

export interface IElevationResponse extends IResponse {
  "dataset": string,
  "elevation": number,
  "location": ICoordinate
}