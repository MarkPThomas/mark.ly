import pointsData from './weather_ly.points.json';
import gridsData from './weather_ly.grids.json';
import groupsData from './weather_ly.pointGroups.json';
import { forecasts as forecastsAlignedData } from './forecastsAligned';
import {
  IGridResponse,
  IGroupResponse,
  IPointResponse
} from '../api/model';

export const points = pointsData as IPointResponse[];
export const grids = gridsData as IGridResponse[];
export const groups = groupsData as IGroupResponse[];
export const forecastsAligned = forecastsAlignedData;