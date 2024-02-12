import { ICoordinate, IGrid } from '../../api/model';
import { Point } from '../../api/forecast';

export const getForecast = (coord: ICoordinate) => {
  return Point.getForecast(coord);
}

export const getForecasts = (coords: ICoordinate[]) => {
  return Point.getForecasts(coords);
}

export const getForecastsByGrids = (grids: IGrid[]) => {
  return Point.getForecastsByGrids(grids);
}