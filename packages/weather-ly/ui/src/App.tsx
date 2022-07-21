import { useState } from 'react';
import { Forecast } from './components/Forecast/Forecast';
import { ForecastHourly } from './components/ForecastHourly/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid/ForecastGrid';
import { Button } from './shared/components/Button'
import { ForeCastSelector } from './components/ForecastSelector/ForecastSelector';

import pointsData from '../../server/db/mongo/data/weather_ly.points.json';
import gridsData from '../../server/db/mongo/data/weather_ly.grids.json';
import groupsData from '../../server/db/mongo/data/weather_ly.pointGroups.json';
import { IGroupResponse, IPointResponse } from '../../server/api/model';


export const App = (props) => {
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
      <div>
        <Button message="Click For Grid Data!" onClick={handleClick} cbArgs={forecastTypes.grid} />
        <Button message="Click For Weekly Forecast!" onClick={handleClick} cbArgs={forecastTypes.weekly} />
        <Button message="Click For Hourly Forecast!" onClick={handleClick} cbArgs={forecastTypes.hourly} />
        <ForeCastSelector
          points={pointsData as IPointResponse[]}
          pointGroups={groupsData as IGroupResponse[]}
        />
        {forecastType === forecastTypes.grid && <ForecastGrid />}
        {forecastType === forecastTypes.weekly && <Forecast />}
        {forecastType === forecastTypes.hourly && <ForecastHourly />}
      </div>
    </>
  );
}