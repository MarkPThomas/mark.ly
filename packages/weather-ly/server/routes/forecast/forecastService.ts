import * as database from './forecastDb';
import * as api from './forecastApi';
import * as data from './forecastData';
import {
  ICoordinate,
  IForecastResponse,
  IGrid,
  IGridResponse,
  IGroupResponse,
  IPointResponse
} from '../../api/model';

export const getForecast = (coord: ICoordinate): Promise<IForecastResponse> => {
  console.log('forecastService...');
  return api.getForecast(coord);
};

export const getForecasts = (coords: ICoordinate[] = []): Promise<IForecastResponse[]> => {
  console.log('coords: ', coords);
  if (coords.length) {
    console.log('getForecasts from api');
    return api.getForecasts(coords);
  } else {
    console.log('getForecasts from static data');
    return getDataForecasts();
  }
};

export const getForecastsByGrids = (grids: IGrid[] = []) => {
  if (grids.length) {
    return api.getForecastsByGrids(grids);
  } else {
    console.log('getForecastsByGridIds from static data');
    return getDataForecasts();
  }
};

const getDataForecasts = (): Promise<IForecastResponse[]> => {
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