import { IResponse } from "@markpthomas/common/api";
import { ICoordinate } from "./ICoordinate";

export interface IElevationResponse extends IResponse {
  "dataset": string,
  "elevation": number,
  "location": ICoordinate
}