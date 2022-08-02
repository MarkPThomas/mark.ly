import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { Points } from './api';

import { Forecast } from './components/Forecast';
import { ForecastHourly } from './components/ForecastHourly/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid/ForecastGrid';
import { ForeCastSelector } from './components/ForecastSelector/ForecastSelector';

import { IGroupResponse, IPointResponse } from '../../server/api/model';

import pointsRaw from '../../server/data/weather_ly.points.json';
console.log('pointsRaw: ', pointsRaw);
import pointGroupsRaw from '../../server/data/weather_ly.pointGroups.json';
console.log('pointGroupsRaw: ', pointGroupsRaw);

export const App = () => {
  const [forecastGroup, setForecastGroup] = useState({} as IGroupResponse);
  const [forecast, setForecast] = useState({} as IPointResponse);
  const [points, setPoints] = useState([] as IPointResponse[]);
  const [pointGroups, setPointGroups] = useState([] as IGroupResponse[]);

  useEffect(() => {
    if (points.length === 0) {
      Points.getPoints()
        .then(result => {
          console.log('getPoints: ', result);
          setForecast(result[0]);
          setPoints(result);
        });
    }

    if (pointGroups.length === 0) {
      Points.getPointGroups()
        .then(result => {
          console.log('getPointGroups: ', result);
          setForecastGroup(result[0]);
          setPointGroups(result);
        });
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <ForeCastSelector
              points={points}
              pointGroups={pointGroups}
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