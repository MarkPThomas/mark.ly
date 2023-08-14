import { IRequest, IRequestItem, IRequestOptions, GetRequestArgs } from "../../../../../common/utils/api/Request";

import { DataSet } from "./DataSet"
import { IBoundingBox } from "./IBoundingBox";
import { ICoordinate } from "./opentopodata"


export interface IElevationRequest extends IRequest<IElevationItem> {
  options: IElevationOptions
}

export interface IElevationItem extends IRequestItem {
  location: ICoordinate;
}

export interface IElevationOptions extends IRequestOptions {
  dataSets: string[];
}

export type GetElevationArgs = GetRequestArgs<IElevationItem, IElevationRequest>;


export const getElevationRequest = (coords: ICoordinate[], boundingBox: IBoundingBox): IElevationRequest => {
  const dataSets = DataSet.getDataSets(boundingBox);

  const requests: IElevationItem[] = coords.map((coord) => ({ location: coord }));

  return {
    items: requests,
    options: { dataSets } as IElevationOptions
  };
}