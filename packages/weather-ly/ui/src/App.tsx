import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { Forecast } from './components/Forecast';
import { ForecastHourly } from './components/ForecastHourly/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid/ForecastGrid';
import { ForeCastSelector } from './components/ForecastSelector/ForecastSelector';

import pointsData from '../../server/db/mongo/data/weather_ly.points.json';
import gridsData from '../../server/db/mongo/data/weather_ly.grids.json';
import groupsData from '../../server/db/mongo/data/weather_ly.pointGroups.json';
import { IGroupResponse, IPointResponse } from '../../server/api/model';


export const App = () => {
  const [forecastGroup, setForecastGroup] = useState({} as IGroupResponse);
  const [forecast, setForecast] = useState({} as IPointResponse);

  useEffect(() => {
    setForecast(pointsData[0]);
    setForecastGroup(groupsData[0]);
  }, []);

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
          <Route path="/weekly" element={<Forecast pointGroup={forecastGroup} />} />
          <Route path="/hourly" element={<ForecastHourly point={forecast} />} />
          <Route path="/gridData" element={<ForecastGrid point={forecast} />} />
          <Route path="/home">
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}