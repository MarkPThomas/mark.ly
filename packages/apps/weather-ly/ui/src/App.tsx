import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { Points as PointsApi } from './api';

import { Forecast } from './components/Forecast';
import { ForecastHourly } from './components/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid';
import { ForeCastSelector } from './components/ForecastSelector';
import { Location } from './components/Location';
import { Group } from './components/Group';

import { IGroupResponse, IPointResponse } from '../../server/api/model';

export const App = () => {
  const [forecastGroup, setForecastGroup] = useState({} as IGroupResponse);
  const [forecast, setForecast] = useState({} as IPointResponse);
  const [points, setPoints] = useState([] as IPointResponse[]);
  const [pointGroups, setPointGroups] = useState([] as IGroupResponse[]);

  useEffect(() => {
    if (points.length === 0) {
      PointsApi.getPoints()
        .then(result => {
          console.log('getPoints: ', result);
          setForecast(result[0]);
          setPoints(result);
        });
    }

    if (pointGroups.length === 0) {
      PointsApi.getPointGroups()
        .then(result => {
          console.log('getPointGroups: ', result);
          setForecastGroup(result[0]);
          setPointGroups(result);
        });
    }
  }, []);

  const handleForecastGroupSelection = (groupId: string) => {
    console.log('groupId: ', groupId);
    console.log('pointGroups: ', pointGroups);
    const selectedGroup = pointGroups.filter(pointGroup => pointGroup.groupId === groupId);
    console.log('selectedGroup: ', selectedGroup);
    setForecastGroup(selectedGroup[0]);
  }

  const handleForecastHourlySelection = (e) => {
    console.log('handleForecastGroupSelection.e', e);
    setForecast(points[e]);
  }

  const handleForecastGridSelection = (e) => {
    console.log('handleForecastGroupSelection.e', e);
    setForecast(points[e]);
  }

  const addPoint = (point: IPointResponse) => {
    // TODO: Push update to server for getting new points
    console.log('Adding point!', point);
    // TODO: Add validation of unique points in local set?
    // TODO: Add validation of unique points in server global set?

    console.log('Old Points:', points);
    const newPoints = [...points];
    newPoints.unshift(point);
    setPoints(newPoints);
    console.log('New Points:', points);
  };

  return (
    <>
      {console.log('forecastGroup: ', forecastGroup)}
      <Router>
        <Routes>
          <Route path="/" element={
            <ForeCastSelector
              pointGroups={pointGroups}
              forecastGroupSelectionHandler={handleForecastGroupSelection}
            />
          } />
          <Route path="/weekly" element={
            <Forecast
              key={forecastGroup.groupId}
              pointGroup={forecastGroup}
              pointGroups={pointGroups}
              forecastGroupSelectionHandler={handleForecastGroupSelection}
            />
          } />
          <Route path="/hourly" element={
            <ForecastHourly
              point={forecast} />
          } />
          <Route path="/gridData" element={
            <ForecastGrid
              point={forecast} />
          } />
          <Route path="/location" element={
            <Location
              points={points}
              pointGroup={forecastGroup}
              pointGroups={pointGroups}
              forecastGroupSelectionHandler={handleForecastGroupSelection}
              addPointsHandler={addPoint}
            />
          } />
          <Route path="/group" element={
            <Group
              points={points}
              pointGroups={pointGroups} />
          } />
          <Route path="/home">
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}