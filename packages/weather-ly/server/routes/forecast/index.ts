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
  const latitudes = req.query.lats;
  const longitudes = req.query.longs;
  const groupName = req.params.groupName;
  if (Array.isArray(latitudes) && Array.isArray(longitudes) && latitudes.length === longitudes.length) {
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
  } else if (groupName) {
    const result = forecastService.getForecastsByGroup(groupName);
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