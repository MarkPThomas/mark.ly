import { useState } from 'react';
import { Forecast } from './components/Forecast/Forecast';
import { ForecastHourly } from './components/ForecastHourly/ForecastHourly';
import { ForecastGrid } from './components/ForecastGrid/ForecastGrid';
import { Button } from './components/shared/Button'

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
        <Button message="Click For Grid Data!" onClick={handleClick} label={forecastTypes.grid} />
        <Button message="Click For Weekly Forecast!" onClick={handleClick} label={forecastTypes.weekly} />
        <Button message="Click For Hourly Forecast!" onClick={handleClick} label={forecastTypes.hourly} />
        {forecastType === forecastTypes.grid && <ForecastGrid />}
        {forecastType === forecastTypes.weekly && <Forecast />}
        {forecastType === forecastTypes.hourly && <ForecastHourly />}
      </div>
    </>
  );
}