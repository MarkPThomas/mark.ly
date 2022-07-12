import { useEffect, useState } from 'react';
import { Point } from '../../../../server/api/forecast'
import { IForecastResponse } from '../../../../server/api/model';
import { IForecastPeriod } from '../../../../server/api/model/NOAA/IForecastPeriod';
import { ForecastTile } from './ForecastTile';

export const Forecast = (props) => {
  const [forecast, setForecast] = useState({} as IForecastResponse);
  let currentKey = 0;

  useEffect(() => {
    Point.getForecast({ latitude: 39.5883597956832, longitude: -105.6434294488281 })
      .then(result => setForecast(result))
      .catch((err) => {
        console.log('Error!', err);
      });
    return () => { };
  }, []);

  return (
    <>
      <div className="forecast-carousel">
        {
          forecast.properties && forecast.properties.periods &&
          forecast.properties.periods.map((period: IForecastPeriod) =>
            <ForecastTile
              key={currentKey++}
              title={period.name}
              url={period.icon}
              snippet={period.shortForecast}
              temp={period.temperature}
              tempUnit={period.temperatureUnit}
              isDaytime={period.isDaytime}
            />
          )
        }

      </div>
      <pre>
        {JSON.stringify(forecast, null, 2)}
      </pre>
    </>
  );
}