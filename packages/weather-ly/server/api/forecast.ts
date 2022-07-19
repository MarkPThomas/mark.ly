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
      GridCache.cache[gridIndex] = new Grid(grid, coords);
    }
  }
}

export class GridPoint {

  static async getForecastGridData(grid: IGrid, updateCache: boolean = false) {
    console.log('Fetching Grid URL for grid data:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastGridResponse>(`${GridPoint.getEndpoint(grid)}`);
    if (updateCache) {
      GridCache.updateCache(grid, result.geometry, result.properties.elevation);
    }
    return result;
  }

  static async getForecast(grid: IGrid, updateCache: boolean = false) {
    console.log('Fetching Grid URL for forecast:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast`);
    if (updateCache) {
      GridCache.updateCache(grid, result.geometry, result.properties.elevation);
    }
    return result;
  }

  static async getForecastHourly(grid: IGrid, updateCache: boolean = false) {
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

  static async getForecastGridData(coord: ICoordinate) {
    const grid: [IGrid, boolean] = await Point.getGrid(coord);
    return GridPoint.getForecastGridData(grid[0], grid[1]);
  }

  static async getForecast(coord: ICoordinate) {
    const grid: [IGrid, boolean] = await Point.getGrid(coord);
    return GridPoint.getForecast(grid[0], grid[1]);
  }

  static async getForecastHourly(coord: ICoordinate) {
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



