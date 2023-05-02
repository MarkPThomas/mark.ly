import { createAxiosInstance } from '../../server/utils/axios';
import {
  IForecastResponse,
  IPointResponse,
  IGroupResponse
} from '../../server/api/model';

const Requests = createAxiosInstance();

export const Forecasts = {
  getForecast: (lat: string, long: string) =>
    Requests.get<IForecastResponse>(`/forecast?lat=${lat}&long=${long}`),
  getForecastByGrid: (gridId: string, gridX: string, gridY: string) =>
    Requests.get<IForecastResponse[]>(`/forecasts?grid=${gridId}&gridX=${gridX}&gridY=${gridY}`),
  getForecasts: (lats: string[], longs: string[]) =>
    Requests.get<IForecastResponse[]>(`/forecasts?lats=${lats.join(',')}&longs=${longs.join(',')}`),
  getForecastsByGrids: (gridIds: string[], gridXs: string[], gridYs: string[]) =>
    Requests.get<IForecastResponse[]>(
      `/forecasts?grids=${gridIds.join(',')}&gridXs=${gridXs.join(',')}&gridYs=${gridYs.join(',')}`
    )
};

export const Points = {
  getPoints: () => Requests.get<IPointResponse[]>('/points'),
  getPointGroups: () => Requests.get<IGroupResponse[]>('/pointGroups')
};