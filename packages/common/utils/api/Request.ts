import { IApiConfig, IApiLimits } from './IApiConfig';
import { IAxiosInstance, createAxiosInstance } from './AxiosInstance';

export interface IRequest<T extends IRequestItem> {
  items: T[];
  options?: IRequestOptions
}

export interface IRequestItem {

}

export interface IRequestOptions {

}

export type GetRequestArgs<T extends IRequestItem, Req extends IRequest<T>> = {
  request: Req,
  updateCache?: boolean
};

export interface IResponse {

}

export abstract class Request<
  Req extends IRequest<ReqItem>,
  Res extends IResponse,
  ReqItem extends IRequestItem,
  ReqArgs extends GetRequestArgs<ReqItem, Req>
> {
  protected static ITEMS_PER_REQUEST = 1000;
  protected static SECONDS_BETWEEN_REQUESTS = 0.5;
  protected static MAX_RETRIES_FOR_REQUEST = 5;
  protected static REQUESTS_PER_DAY = 1000;

  protected _requests: IAxiosInstance;
  protected _config: IApiConfig<IApiLimits>;
  protected _delayMS: number;
  protected _maxRetries: number;
  protected _maxItemsPerRequest: number;
  protected _cache: Map<string, Res>;

  constructor(apiConfig: IApiConfig<IApiLimits>) {
    this._config = apiConfig;
    this._delayMS = (apiConfig.limits ? apiConfig.limits.secondsBetweenRequests : Request.SECONDS_BETWEEN_REQUESTS) * 1000;
    this._maxRetries = apiConfig.limits ? apiConfig.limits.maxRetriesForRequest : Request.MAX_RETRIES_FOR_REQUEST;
    this._maxItemsPerRequest = apiConfig.limits ? apiConfig.limits?.itemsPerRequest : Request.ITEMS_PER_REQUEST;
    this._requests = createAxiosInstance(apiConfig.baseUrl);
  }

  async getItems({ request, updateCache = true }: ReqArgs): Promise<{
    results: Res[],
    messages?: string[]
  }> {
    if (!request) {
      return {
        results: [],
        messages: ['Request not specified. Request aborted.']
      };
    }

    const results: Res[] = [];
    const messages: string[] = [];

    let payloadBatchIndex = 0;
    let result: Res | undefined = undefined;
    const payloadBatches = this.splitPayloadIntoBatches(request.items);
    console.log(`${payloadBatches.length} payloadBatches to request`)

    // while (payloadBatchIndex < payloadBatches.length) {
    let retries = this._maxRetries;
    const batchItems = this.getCurrentBatch(payloadBatches, payloadBatchIndex);
    const endpoint = this.getEndpoint(batchItems, request.options);
    console.log(`${batchItems.length} batchItems to request from current batch`)

    // console.log(`Fetching: ${endpoint}`);
    while (!result && retries) {
      result = await this.getOnce(endpoint, updateCache);
      if (!result) {
        retries--;
        console.log(`${retries}/${this._maxRetries} retries for ${endpoint}`);
        console.log(`Waiting ${this._delayMS} ms before next request`);
        await this.sleep(this._delayMS);
      } else {
        results.push(result);
        payloadBatchIndex++;
        break;
      }
    }

    if (!retries) {
      messages.push(`Failed to get payload for ${endpoint}`);
      payloadBatchIndex++;
    }
    // }
    console.log(`500 Error retrieving result. Locally limited max number of ${this._maxRetries} retries attempted.`);

    return messages.length ? { results, messages } : { results };
  }

  protected async getOnce(
    endpoint: string,
    updateCache?: boolean
  ): Promise<Res | undefined> {
    let result;
    if (updateCache && !this._cache) {
      this._cache = new Map();
    }

    if (updateCache && this._cache.has(endpoint)) {
      result = this._cache.get(endpoint);
    } else {
      try {
        result = await this._requests.get<Res>(endpoint);
        console.log(`Success`);
      } catch (error) {
        console.log(`Fail: `, error);
        return;
      }

      if (updateCache && result) {
        console.log('Updating cache')
        this._cache.set(endpoint, result);
      }
    }
    return result;
  }

  protected splitPayloadIntoBatches(requests: IRequestItem[]): IRequestItem[][] {
    const requestBatches: IRequestItem[][] = [];
    for (let i = 0; i < requests.length; i += this._maxItemsPerRequest) {
      requestBatches.push(requests.slice(i, i + this._maxItemsPerRequest));
    }

    return requestBatches;
  }

  protected getCurrentBatch(requests: IRequestItem[][], batchIndex: number) {
    const request = requests[batchIndex];

    const coordinateStartCount = batchIndex > 0
      ? batchIndex * this._maxItemsPerRequest
      : 0;

    const currentCoordinateCount = (batchIndex === requests.length - 1)
      ? request.length
      : this._maxItemsPerRequest;

    const coordinateEndCount = coordinateStartCount + currentCoordinateCount;

    console.log(`Fetching for items ${coordinateStartCount} to ${coordinateEndCount} in batch ${batchIndex + 1}`);

    return request;
  }

  protected sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  protected abstract getEndpoint(request: IRequestItem, options?: IRequestOptions): string;
}
