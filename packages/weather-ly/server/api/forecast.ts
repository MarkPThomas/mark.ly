import { promises as fsPromises } from 'fs';

import { Requests } from './api';

import {
  ICoordinate,
  IGrid,
  IPointForecastResponse,
  IForecastGridResponse,
  IForecastResponse,
  Grid,
} from './model';

import { GridCache } from './model/GridCache';



export class GridPoint {

  static async getForecastGridData(grid: IGrid, updateCache: boolean = false): Promise<IForecastGridResponse> {
    console.log('Fetching Grid URL for grid data:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastGridResponse>(`${GridPoint.getEndpoint(grid)}`);
    if (updateCache) {
      GridCache.updateCache(grid, result.geometry, result.properties.elevation);
    }
    return result;
  }

  static async getForecast(grid: IGrid, updateCache?: boolean): Promise<IForecastResponse | undefined> {
    console.log('Fetching Grid URL for forecast:', GridPoint.getEndpoint(grid));
    let retries = 5;
    const delayMs = 250;
    let result: IForecastResponse | undefined = undefined;
    updateCache = updateCache ?? GridCache.containsGrid({ grid });

    while (!result && retries) {
      result = await GridPoint.getForecastOnce(grid, updateCache);
      if (!result) {
        retries--;
        console.log(`${GridPoint.getEndpoint(grid)}/forecast retries=${retries}`);
        await sleep(delayMs);
      } else {
        return result;
      }
    }
    console.log('500 Error retrieving result. Max number of retries reached');
    return result;
  }

  private static async getForecastOnce(grid: IGrid, updateCache: boolean = false): Promise<IForecastResponse | undefined> {
    try {
      const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast`);
      if (updateCache) {
        GridCache.updateCache(grid, result.geometry, result.properties.elevation);
      }
      console.log(`${GridPoint.getEndpoint(grid)}/forecast getForecastOnce: Success`);
      return result;
    } catch (error) {
      console.log(`${GridPoint.getEndpoint(grid)}/forecast: Fail: `, error);
      return;
    }
  }

  static async getForecastHourly(grid: IGrid, updateCache: boolean = false): Promise<IForecastResponse> {
    console.log('Fetching Grid URL for hourly forecast:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast/hourly`);
    if (updateCache) {
      GridCache.updateCache(grid, result.geometry, result.properties.elevation);
    }
    return result;
  }

  private static getEndpoint(grid: IGrid): string {
    return `/gridpoints/${grid.gridId}/${grid.gridX},${grid.gridY}`;
  }
}

export class Point {

  static async getForecastGridData(coord: ICoordinate): Promise<IForecastGridResponse> {
    const grid = await Point.getGrid(coord);
    return GridPoint.getForecastGridData(grid.grid, grid.updateCache);
  }

  static async getForecast(coord: ICoordinate, writeData = false): Promise<IForecastResponse | undefined> {
    const grid = await Point.getGrid(coord);
    console.log('Getting forecast for coord: ', coord);
    const response = await GridPoint.getForecast(grid.grid, grid.updateCache);

    if (writeData && response) {
      console.log('Writing response to file...');
      fsPromises.writeFile(
        `./server/data/forecast.lat${coord.latitude}.long${coord.longitude}.json`,
        JSON.stringify(response, null, '\t'),
        'utf-8'
      )
    }

    return response;
  }

  static async getForecasts(coords: ICoordinate[]): Promise<IForecastResponse[]> {
    const forecastCBs = [];
    coords.forEach(coord => {
      forecastCBs.push(Point.getForecast(coord));
    })
    const rawForecasts: IForecastResponse[] = await Promise.all(forecastCBs);
    return alignAndTrimForecasts(rawForecasts);
  }

  static async getForecastsByGrids(grids: IGrid[]): Promise<IForecastResponse[]> {
    const forecastCBs = [];
    grids.forEach(grid => {
      forecastCBs.push(() => GridPoint.getForecast(grid));
    })
    const rawForecasts: IForecastResponse[] = await Promise.all(forecastCBs);
    return alignAndTrimForecasts(rawForecasts);
  }

  static async getForecastHourly(coord: ICoordinate): Promise<IForecastResponse> {
    const grid = await Point.getGrid(coord);
    return GridPoint.getForecastHourly(grid.grid, grid.updateCache);
  }

  private static getEndpoint(coord: ICoordinate): string {
    return `/points/${coord.latitude},${coord.longitude}`;
  }

  private static async getGrid(coord: ICoordinate): Promise<{ grid: IGrid, updateCache: boolean }> {
    let updateCache = false;
    let grid: IGrid = GridCache.getGrid(coord);
    if (!grid) {
      console.log('Getting grid from API...');
      grid = await Point.getGridFromAPI(coord);
      updateCache = true;
      GridCache.cache.push(new Grid(grid));
    }
    return { grid, updateCache };
  }

  private static async getGridFromAPI(coord: ICoordinate): Promise<IGrid> {
    console.log('Fetching Point URL:', Point.getEndpoint(coord));
    const result = await Requests.get<IPointForecastResponse>(`${Point.getEndpoint(coord)}`);
    return {
      gridId: result.properties.gridId,
      gridX: result.properties.gridX,
      gridY: result.properties.gridY,
      elevation: undefined
    };
  };
}

const alignAndTrimForecasts = (rawForecasts: IForecastResponse[]): IForecastResponse[] => {
  let offsetsAndLengths: offsetsAndLengths = {
    maxDayIndexOffset: 0,
    minDayIndexOffset: Number.POSITIVE_INFINITY,
    minLength: Number.POSITIVE_INFINITY
  }

  const offsetForecasts: offsetForecast[] = [];
  rawForecasts.forEach(rawForecast => {
    const results = getOffsetsAndLengths(rawForecast, offsetsAndLengths)
    offsetForecasts.push(results.offsetForecast);
    offsetsAndLengths = results.currentOffsetsAndLengths;
  });
  console.log('offset Forecasts: ', offsetForecasts);

  const normalizedForecasts: IForecastResponse[] =
    trimForecasts(offsetForecasts, offsetsAndLengths);

  return normalizedForecasts;
}

export enum Days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

type offsetForecast = {
  offset: number;
  // offsetLength: number;
  rawForecast: IForecastResponse
};

type offsetsAndLengths = {
  maxDayIndexOffset: number,
  minDayIndexOffset: number,
  minLength: number
}

const getOffsetsAndLengths = (
  rawForecast: IForecastResponse,
  current: offsetsAndLengths
) => {
  const offsetForecast: offsetForecast = {
    offset: 0,
    // offsetLength: periods.length,
    rawForecast
  };

  if (rawForecast) {
    const periods = rawForecast.properties.periods;
    for (let i = 0; i < periods.length; i++) {
      const titleComponent = periods[i].name.split(' ')[0];
      if (Days[titleComponent]) {
        const offsetLength = periods.length - i;
        if (i > current.maxDayIndexOffset) {
          current.maxDayIndexOffset = i;
        }
        if (i < current.minDayIndexOffset) {
          current.minDayIndexOffset = i;
        }
        if (offsetLength < current.minLength) {
          current.minLength = offsetLength;
        }
        if (i > offsetForecast.offset) {
          offsetForecast.offset = i;
          // offsetForecast.offsetLength = offsetLength;
        }
        break;
      }
    }
  }

  return {
    offsetForecast,
    currentOffsetsAndLengths: current
  };
}

const trimForecasts = (offsetForecasts: offsetForecast[], offsetsAndLengths: offsetsAndLengths) => {
  const normalizedForecasts: IForecastResponse[] = [];
  const deltaDayIndexOffset = offsetsAndLengths.maxDayIndexOffset - offsetsAndLengths.minDayIndexOffset;
  const deltaMinLength = offsetsAndLengths.minLength + deltaDayIndexOffset;

  offsetForecasts.forEach(offsetForecast => {
    const trimmedForecast =
      trimForecast(offsetForecast, offsetsAndLengths.maxDayIndexOffset, deltaDayIndexOffset, deltaMinLength);
    normalizedForecasts.push(trimmedForecast.rawForecast);
  })

  return normalizedForecasts;
}

const trimForecast = (
  offsetForecast: offsetForecast,
  maxDayIndexOffset: number,
  deltaDayIndexOffset: number,
  deltaMinLength: number) => {

  if (!offsetForecast.rawForecast) {
    return offsetForecast;
  }
  const localDeltaMaxIndex = maxDayIndexOffset - offsetForecast.offset;
  const localStartIndex = deltaDayIndexOffset + localDeltaMaxIndex;
  const localEndIndex = localStartIndex + deltaMinLength;

  console.log('localDeltaMaxIndex: ', localDeltaMaxIndex);
  console.log('localStartIndex: ', localStartIndex);
  console.log('localEndIndex: ', localEndIndex);

  const normalizedPeriods = offsetForecast.rawForecast.properties.periods.slice(localStartIndex, localEndIndex);
  console.log('Periods normalized');
  offsetForecast.rawForecast.properties.periods = normalizedPeriods;
  return offsetForecast;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

