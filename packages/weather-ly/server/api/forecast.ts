import { requests } from './api';
import { ICoord, IGrid } from './model';

export class GridPoint {
  static async getForecastGridData(grid: IGrid) {
    const result = await requests.get(`${GridPoint.getEndpoint(grid)}`);
    console.log('Result is:', result);
    return result;
  }

  static async getForecast(grid: IGrid) {
    // const { data, status } = await instance.get<GetForecastResponse>(`/${latLong}/forecast`);
    console.log('Fetching Grid URL:', GridPoint.getEndpoint(grid));
    const result = await requests.get(`${GridPoint.getEndpoint(grid)}/forecast`);
    console.log('Result is:', result);
    return result;
  }

  static async getForecastHourly(grid: IGrid) {
    const result = await requests.get(`${GridPoint.getEndpoint(grid)}/forecast/hourly`);
    console.log('Result is:', result);
    return result;
  }

  private static getEndpoint(grid: IGrid): string {
    return `/gridpoints/${grid.office}/${grid.gridX},${grid.gridY}`;
  }
}

export class Point {

  static async getForecastGridData(latLong: ICoord) {

  }

  static async getForecast(coord: ICoord) {
    console.log('Fetching Point URL:', Point.getEndpoint(coord));
    // const { data, status } = await instance.get<GetForecastResponse>(`/${latLong}/forecast`);
    const result = await requests.get(`${Point.getEndpoint(coord)}`);
    console.log('Result is:', result);

    const grid: IGrid = Point.getGrid(result);

    // console.log('Response status is: ', status);
    return GridPoint.getForecast(grid);
  }

  static async getForecastHourly(latLong: ICoord) {

  }

  private static getGrid(result): IGrid {
    return {
      office: result.properties.gridId,
      gridX: result.properties.gridX,
      gridY: result.properties.gridY
    }
  }

  private static getEndpoint(coord: ICoord): string {
    return `/points/${coord.latitude},${coord.longitude}`;
  }
}



