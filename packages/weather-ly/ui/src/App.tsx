import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { ForecastCarousel } from './components/Forecast/ForecastCarousel';
import { ForecastHourly } from './components/ForecastHourly/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid/ForecastGrid';
import { ForeCastSelector } from './components/ForecastSelector/ForecastSelector';

import pointsData from '../../server/db/mongo/data/weather_ly.points.json';
import gridsData from '../../server/db/mongo/data/weather_ly.grids.json';
import groupsData from '../../server/db/mongo/data/weather_ly.pointGroups.json';
import { IGroupResponse, IPointResponse } from '../../server/api/model';


export const App = () => {
  const forecastTypes = {
    grid: 'grid',
    weekly: 'weekly',
    hourly: 'hourly'
  }

  const [forecastType, setForecastType] = useState(forecastTypes.weekly);

  const handleClick = (newForecastType) => {
    console.log('Setting Type', newForecastType);
    setForecastType(newForecastType);
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <ForeCastSelector
              points={pointsData as IPointResponse[]}
              pointGroups={groupsData as IGroupResponse[]}
            />
          } />
          <Route path="/weekly" element={<ForecastCarousel />} />
          <Route path="/hourly" element={<ForecastHourly />} />
          <Route path="/gridData" element={<ForecastGrid />} />
          <Route path="/home">
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}