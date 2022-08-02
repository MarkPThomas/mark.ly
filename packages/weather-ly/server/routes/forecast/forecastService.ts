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

export const getForecasts = (coords: ICoordinate[] = []): Promise<IForecastResponse[]> => {
  if (coords.length) {
    return api.getForecasts(coords);
  } else {
    return new Promise((resolve, reject) => {
      console.log('Getting forecasts from data...')
      const result: IForecastResponse[] = data.getStaticForecasts();
      if (result) {
        console.log('getForecasts Result: ', result);
        resolve(result);
      } else {
        console.log('getForecasts faied!');
        reject();
      }
    });
  }
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