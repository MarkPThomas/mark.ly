export interface IApiConfig<T extends IApiLimits> {
  baseUrl: string,
  limits?: T
}

export interface IApiLimits {
  itemsPerRequest: number,
  secondsBetweenRequests: number,
  maxRetriesForRequest: number,
  requestsPerDay: number
}