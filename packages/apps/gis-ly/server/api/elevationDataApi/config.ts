import { IApiConfig, IApiLimits } from "common/utils/api/IApiConfig";

export default {
  api: {
    baseUrl: `https://api.opentopodata.org/`,
    limits: {
      itemsPerRequest: 100,   // Implemented in request object.
      secondsBetweenRequests: 1,  // Implemented in request w/ retries.
      maxRetriesForRequest: 5, // arbitratry
      requestsPerDay: 1000, //TODO: Implement in cookie that tracks this?
      // Count during session, write to cookie at intervals & during close. Load count from cookie at start.
    }
  } as IApiConfig<IApiLimits>
}