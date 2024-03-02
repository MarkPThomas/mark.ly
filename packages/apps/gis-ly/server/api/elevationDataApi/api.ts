import { IElevationResponse } from './model/opentopodata';

import config from './config';
import { ICoordinate, IBoundingBox } from './model';
import { ElevationRequest } from './model/ElevationRequest';
import { getElevationRequest } from './model/Elevation';

export class ElevationRequestApi {
  private _pointElevationRequest = new ElevationRequest(config.api);
  private _cache: Map<string, number> = new Map();

  async getElevations(coords: ICoordinate[], boundingBox: IBoundingBox): Promise<IElevationResponse> {
    const coordsCache: ICoordinate[] = [];
    const coordsRequest: ICoordinate[] = [];

    coords.forEach((coord) => {
      if (this._cache.has(JSON.stringify(coord))) {
        coordsCache.push(coord);
      } else {
        coordsRequest.push(coord);
      }
    });

    const elevationsRequest = getElevationRequest(coordsRequest, boundingBox);

    const { results, messages } = await this._pointElevationRequest.getItems({ request: elevationsRequest });

    if (results) {
      results.forEach((result) => {
        this._cache.set(JSON.stringify(result.location), result.elevation);
      });
    }

    return { elevations: { ...this._cache }, messages };
  }
}

