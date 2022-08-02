import { Requests } from './api';
import {
  ICoordinate,
  IGrid,
  IPointForecastResponse,
  IForecastGridResponse,
  IForecastResponse,
  Coordinate,
  Grid,
  IGeometry,
  IElevation
} from './model';

import { promises as fsPromises } from 'fs';

class GridCache {
  static cache: Grid[] = [];

  static getGrid(coord: ICoordinate): IGrid | null {
    let currentGrid = null;
    GridCache.cache.forEach(grid => {
      if (grid.isInGrid(coord)) {
        console.log(`Getting Grid ${JSON.stringify(grid)} from cache ${JSON.stringify(GridCache.cache)}`);
        currentGrid = grid;
        return;
      }
    });
    return currentGrid;
  }

  static getIndex(grid: IGrid): number {
    let index = -1;
    GridCache.cache.forEach((gridCurrent, indexCurrent) => {
      if (gridCurrent.gridId === grid.gridId
        && gridCurrent.gridX === grid.gridX
        && gridCurrent.gridY === grid.gridY) {
        console.log(`Getting Grid index ${indexCurrent} from cache ${JSON.stringify(GridCache.cache)}`);
        index = indexCurrent;
        return;
      }
    });
    return index;
  }

  static updateCache(grid: IGrid, geometry: IGeometry, elevation: IElevation) {
    console.log('Updating cache...');
    const gridIndex = GridCache.getIndex(grid);
    console.log(`Grid cached at index ${gridIndex}`);
    if (gridIndex >= 0) {
      const coords = [
        new Coordinate(geometry.coordinates[0][0]),
        new Coordinate(geometry.coordinates[0][1]),
        new Coordinate(geometry.coordinates[0][2]),
        new Coordinate(geometry.coordinates[0][3])
      ]
      GridCache.cache[gridIndex] = new Grid(grid, coords, elevation);
    }
  }
}

export class GridPoint {

  static async getForecastGridData(grid: IGrid, updateCache: boolean = false): Promise<IForecastGridResponse> {
    console.log('Fetching Grid URL for grid data:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastGridResponse>(`${GridPoint.getEndpoint(grid)}`);
    if (updateCache) {
      GridCache.updateCache(grid, result.geometry, result.properties.elevation);
    }
    return result;
  }

  static async getForecast(grid: IGrid, updateCache: boolean = false): Promise<IForecastResponse> {
    console.log('Fetching Grid URL for forecast:', GridPoint.getEndpoint(grid));
    let retries = 5;
    let delayMs = 500;
    if (retries) {
      try {
        // let result;
        // setTimeout(async () => {
        //   console.log('setTimeout for result');
        //   result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast`);
        //   if (updateCache) {
        //     GridCache.updateCache(grid, result.geometry, result.properties.elevation);
        //   }
        // }, delayMs)
        const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast`);
        if (updateCache) {
          GridCache.updateCache(grid, result.geometry, result.properties.elevation);
        }
        console.log('Returning result');
        return result;
      } catch (error) {
        retries--;
        console.log(`${GridPoint.getEndpoint(grid)}/forecast retries=${retries}`);
        return;
      }
    } else {

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

export class Point {

  static async getForecastGridData(coord: ICoordinate): Promise<IForecastGridResponse> {
    const grid: [IGrid, boolean] = await Point.getGrid(coord);
    return GridPoint.getForecastGridData(grid[0], grid[1]);
  }

  // TODO: Make server http call to this from react rather than import
  static async getForecast(coord: ICoordinate): Promise<IForecastResponse> {
    const grid: [IGrid, boolean] = await Point.getGrid(coord);
    // return GridPoint.getForecast(grid[0], grid[1]);
    const response = await GridPoint.getForecast(grid[0], grid[1]);
    // if (response) {
    //   fsPromises.writeFile(
    //     `forecast-${response.geometry.coordinates[0][0]}.${response.geometry.coordinates[0][1]}.json`,
    //     JSON.stringify(response),
    //     'utf-8'
    //   )
    // }
    return response;
  }

  static async getForecasts(coords: ICoordinate[]): Promise<IForecastResponse[]> {
    const forecastCBs = [];
    coords.forEach(coord => {
      forecastCBs.push(() => Point.getForecast(coord));
    })
    const rawForecasts: IForecastResponse[] = await Promise.all(forecastCBs);

    // Determine offset index
    let maxDayIndexOffset = 0;
    let minDayIndexOffset = Number.POSITIVE_INFINITY;
    let minLength = Number.POSITIVE_INFINITY;

    const offsetForecasts: offsetForecast[] = [];
    rawForecasts.forEach(rawForecast => {
      const periods = rawForecast.properties.periods;
      const offsetForecast: offsetForecast = {
        offset: 0,
        // offsetLength: periods.length,
        rawForecast
      };
      for (let i = 0; i < periods.length; i++) {
        const titleComponent = periods[i].name.split(' ')[0];
        if (Days[titleComponent]) {
          const offsetLength = periods.length - i;
          if (i > maxDayIndexOffset) {
            maxDayIndexOffset = i;
          }
          if (i < minDayIndexOffset) {
            minDayIndexOffset = i;
          }
          if (offsetLength < minLength) {
            minLength = offsetLength;
          }
          if (i > offsetForecast.offset) {
            offsetForecast.offset = i;
            // offsetForecast.offsetLength = offsetLength;
          }
          break;
        }
      }
      offsetForecasts.push(offsetForecast);
    });
    console.log('offset Forecasts: ', offsetForecasts);

    // Trim left or right to new array
    const normalizedForecasts: IForecastResponse[] = [];
    const deltaDayIndexOffset = maxDayIndexOffset - minDayIndexOffset;
    const deltaMinLength = minLength + deltaDayIndexOffset;
    offsetForecasts.forEach(offsetForecast => {
      const localDeltaMaxIndex = maxDayIndexOffset - offsetForecast.offset;
      const localStartIndex = deltaDayIndexOffset + localDeltaMaxIndex;
      const localEndIndex = localStartIndex + deltaMinLength;

      const normalizedPeriods = offsetForecast.rawForecast.properties.periods.slice(localStartIndex, localEndIndex);
      console.log('normalized periods: ', normalizedPeriods);
      offsetForecast.rawForecast.properties.periods = normalizedPeriods;
      normalizedForecasts.push(offsetForecast.rawForecast);
    })
    console.log('normalized Forecasts: ', normalizedForecasts);

    return normalizedForecasts;
  }

  static async getForecastsByGroup(groupName: string): Promise<IForecastResponse[]> {
    // TODO: Get coords by group name
    const coords = [];
    return Point.getForecasts(coords);
  }

  static async getForecastHourly(coord: ICoordinate): Promise<IForecastResponse> {
    const grid: [IGrid, boolean] = await Point.getGrid(coord);
    return GridPoint.getForecastHourly(grid[0], grid[1]);
  }

  private static getEndpoint(coord: ICoordinate): string {
    return `/points/${coord.latitude},${coord.longitude}`;
  }

  private static async getGrid(coord: ICoordinate): Promise<[IGrid, boolean]> {
    let updateCache = false;
    let grid: IGrid = GridCache.getGrid(coord);
    if (!grid) {
      console.log('Getting grid from API...');
      grid = await Point.getGridFromAPI(coord);
      updateCache = true;
      GridCache.cache.push(new Grid(grid));
    }
    return [grid, updateCache];
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



