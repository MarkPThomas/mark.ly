import { IPointResponse } from "./IPointResponse";

export interface IGroupResponse {
  name: string;
  groupId: number;
  points: IPointResponse[];
}