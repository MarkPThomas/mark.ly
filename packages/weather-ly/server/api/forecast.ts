import { requests, Requests } from './api';
import {
  ICoord,
  IGrid,
  IPointForecastResponse,
  IForecastGridResponse,
  IForecastResponse
} from './model';

export class GridPoint {
  static async getForecastGridData(grid: IGrid) {
    console.log('Fetching Grid URL for grid data:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastGridResponse>(`${GridPoint.getEndpoint(grid)}`);
    console.log('Result is:', result);
    return result;
  }

  static async getForecast(grid: IGrid) {
    console.log('Fetching Grid URL for forecast:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast`);
    console.log('Result is:', result);
    return result;
  }

  static async getForecastHourly(grid: IGrid) {
    console.log('Fetching Grid URL for hourly forecast:', GridPoint.getEndpoint(grid));
    const result = await Requests.get<IForecastResponse>(`${GridPoint.getEndpoint(grid)}/forecast/hourly`);
    console.log('Result is:', result);
    return result;
  }

  private static getEndpoint(grid: IGrid): string {
    return `/gridpoints/${grid.office}/${grid.gridX},${grid.gridY}`;
  }
}

export class Point {

  static async getForecastGridData(coord: ICoord) {
    const grid: IGrid = await Point.getGrid(coord);
    return GridPoint.getForecastGridData(grid);
  }

  static async getForecast(coord: ICoord) {
    const grid: IGrid = await Point.getGrid(coord);
    return GridPoint.getForecast(grid);
  }

  static async getForecastHourly(coord: ICoord) {
    const grid: IGrid = await Point.getGrid(coord);
    return GridPoint.getForecastHourly(grid);
  }

  private static async getGrid(coord: ICoord): Promise<IGrid> {
    console.log('Fetching Point URL:', Point.getEndpoint(coord));
    const result = await Requests.get<IPointForecastResponse>(`${Point.getEndpoint(coord)}`);
    console.log('Result is:', result);

    return {
      office: result.properties.gridId,
      gridX: result.properties.gridX,
      gridY: result.properties.gridY
    };
  }

  private static getEndpoint(coord: ICoord): string {
    return `/points/${coord.latitude},${coord.longitude}`;
  }
}



