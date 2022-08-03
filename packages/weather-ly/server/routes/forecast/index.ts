// NOTE: Middleware module aka. {routeName}Controller.ts
import { Request, Response } from 'express';
import { ICoordinate } from '../../api/model';
import * as forecastService from './forecastService';

export const getForecast = async (req: Request, res: Response, next) => {
  console.log('forecast');
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.long);
  if (latitude && longitude) {
    console.log('getting forecast');
    const coord: ICoordinate = {
      latitude,
      longitude
    };
    const result = await forecastService.getForecast(coord);
    res.send(result);
  }
}

export const getForecasts = async (req: Request, res: Response, next) => {
  const latitudes = (req.query.lats as string).split(',');
  const longitudes = (req.query.longs as string).split(',');
  const grids = req.params.grids;

  console.log('req.query: ', req.query);
  console.log('latitudes:', latitudes);
  console.log('longitudes:', longitudes);

  if (
    Array.isArray(latitudes) && Array.isArray(longitudes)
    && latitudes.length
    && latitudes.length === longitudes.length
  ) {
    const coords: ICoordinate[] = [];
    for (let i = 0; i < latitudes.length; i++) {
      const latitude = Number(latitudes[i]);
      const longitude = Number(longitudes[i]);
      if (latitude && longitude) {
        const coord: ICoordinate = {
          latitude,
          longitude
        };
        coords.push(coord);
      }
    }

    const result = await forecastService.getForecasts(coords);
    res.send(result);
  } else if (
    Array.isArray(grids)
    && grids.length
  ) {
    const result = await forecastService.getForecastsByGrids(grids);
    res.send(result);
  } else {
    console.log('Getting static forecasts');
    const result = await forecastService.getForecasts();
    res.send(result);
  }
}

export const getAllPoints = async (req: Request, res: Response, next) => {
  console.log('getting all points...');
  const result = await forecastService.getAllPoints();
  console.log('points received');
  res.send(result);
};

export const getAllPointGroups = async (req: Request, res: Response, next) => {
  const result = await forecastService.getAllPointGroups();
  res.send(result);
};

export const getAllGrids = async (req: Request, res: Response, next) => {
  const result = await forecastService.getAllGrids();
  res.send(result);
};