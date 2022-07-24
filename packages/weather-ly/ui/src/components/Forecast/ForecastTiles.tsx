import { useEffect, useState } from 'react';
import { Point } from '../../../../server/api/forecast'
import { IForecastResponse, IPointResponse } from '../../../../server/api/model';
import { IForecastPeriod } from '../../../../server/api/model/NOAA/IForecastPeriod';
import { ForecastTile } from './ForecastTile';

type Prop = {
  coordinate: IPointResponse;
};

export const ForecastTiles = (props: Prop) => {
  const [forecast, setForecast] = useState({} as IForecastResponse);
  let currentKey = 0;

  useEffect(() => {
    Point.getForecast(props.coordinate)
      .then((result) => {
        console.log('Forecast for: ', props.coordinate);
        console.log(result);
        setForecast(result);
      })
      .catch((err) => {
        console.log('Error!', err);
      });
    return () => { };
  }, []);

  return (
    <>
      <div className="forecast-tiles">
        {
          forecast.properties && forecast.properties.periods &&
          forecast.properties.periods.map((period: IForecastPeriod) =>
            <ForecastTile
              key={`${props.coordinate.latitude}-${props.coordinate.longitude}-${currentKey++}`}
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
      {/* <pre>
        {JSON.stringify(forecast, null, 2)}
      </pre> */}
    </>
  );
}