import { createAxiosInstance } from '../../server/utils/axios';
import {
  IForecastResponse,
  IPointResponse,
  IGroupResponse
} from '../../server/api/model';

const Requests = createAxiosInstance();

export const Forecasts = {
  getForecast: (lat: string, long: string) => Requests.get<IForecastResponse>(`/forecast?lat=${lat}&long=${long}`),
  getForecasts: (lats: string[], longs: string[]) => {
    Requests.get<IForecastResponse[]>(`/forecasts?lats=${lats}&longs=${longs}`)
  },
  getForecastsByGroups: (groupName: string) => Requests.get<IForecastResponse[]>(`/forecasts?group=${groupName}`)
};

export const Points = {
  getPoints: () => Requests.get<IPointResponse[]>('/points'),
  getPointGroups: () => Requests.get<IGroupResponse[]>('/pointGroups')
};