import * as database from './forecastDb';
import * as api from './forecastApi';
import * as data from './forecastData';
import {
  ICoordinate,
  IForecastResponse,
  IGridResponse,
  IGroupResponse,
  IPointResponse
} from '../../api/model';

export const getForecast = (coord: ICoordinate): Promise<IForecastResponse> => {
  console.log('forecastService...');
  return api.getForecast(coord);
};

export const getForecasts = (coords: ICoordinate[]): Promise<IForecastResponse[]> => {
  return api.getForecasts(coords);
};

export const getForecastsByGroup = (groupName: string) => {
  return api.getForecastsByGroup(groupName);
};

export const getAllPoints = (): Promise<IPointResponse[]> => {
  return new Promise((resolve, reject) => {
    const result: IPointResponse[] = data.getAllPoints();
    if (result) {
      resolve(result);
    } else {
      reject();
    }
  });
};

export const getAllPointGroups = (): Promise<IGroupResponse[]> => {
  return new Promise((resolve, reject) => {
    const result: IGroupResponse[] = data.getAllPointGroups();
    if (result) {
      resolve(result);
    } else {
      reject();
    }
  });
};

export const getAllGrids = (): Promise<IGridResponse[]> => {
  return new Promise((resolve, reject) => {
    const result: IGridResponse[] = data.getAllGrids();
    if (result) {
      resolve(result);
    } else {
      reject();
    }
  });
};