import { Request } from 'common/utils/api/Request';

import {
  IElevationRequest, IElevationResponse, IElevationItem, IElevationOptions, GetElevationArgs
} from '.';

export class ElevationRequest extends Request<IElevationRequest, IElevationResponse, IElevationItem, GetElevationArgs> {
  protected getEndpoint(request: IElevationItem[], options?: IElevationOptions) {
    const locationsURI = request.map((item) => `${item.location.lat},${item.location.lng}`);
    return `/v1/${options.dataSets.join()}?locations=${locationsURI.join('|')}`;
    // https://api.opentopodata.org/v1/aster30m?locations=<lat,lng[|{lat,lng}...]>
  }
}

export { GetElevationArgs };
export { IElevationResponse };