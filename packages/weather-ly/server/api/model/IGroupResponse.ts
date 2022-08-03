import { IForecastResponse } from ".";
import { IPointResponse } from "./IPointResponse";

export interface IGroupResponse {
  name: string;
  groupId: string;
  points: IPointResponse[];
  forecasts?: {
    [key: string]: IForecastResponse
  }
}