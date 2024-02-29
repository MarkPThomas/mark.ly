import { createAxiosInstance } from '@markpthomas/common/api'
import {
  ITileApiKeysResponse as ITileApiKeyResponse
} from '../../server/api/model';

const Requests = createAxiosInstance();

export const Tiles = {
  getApiKey: (apiKeyName: string) => Requests.get<ITileApiKeyResponse>(`/tileApiKey/?apiKeyName=${apiKeyName}`)
};