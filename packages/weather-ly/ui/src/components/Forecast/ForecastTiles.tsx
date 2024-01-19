
import { useEffect, useState } from 'react';

import { IForecastResponse, IPointResponse } from '../../../../server/api/model';
import { IForecastPeriod } from '../../../../server/api/model/NOAA/IForecastPeriod';
import { Forecasts } from '../../api';

import { ForecastTile } from './ForecastTile';

type Prop = {
  coordinate?: IPointResponse;
  forecast?: IForecastResponse;
};

export const ForecastTiles = (props: Prop) => {
  const [forecast, setForecast] = useState({} as IForecastResponse);
  const [showSnippet, setShowSnippet] = useState(false);
  let currentKey = 0;

  useEffect(() => {
    const forecastProps = props.forecast;
    console.log('ForecastTiles-forecast: ', forecast);
    console.log('ForecastTiles-forecastProps: ', forecastProps);
    const coordinate = props.coordinate;
    console.log('ForecastTiles-coordinate: ', coordinate);
    if (forecastProps && !Object.keys(forecast).length) {
      console.log('Setting supplied forecasts');
      setForecast(forecastProps);
    } else if (coordinate && !Object.keys(forecast).length) {
      const latitude = coordinate.latitude.toString();
      const longitude = coordinate.longitude.toString();
      console.log('Getting forecast for coordinate:', coordinate);
      Forecasts.getForecast(latitude, longitude)
        .then((result) => {
          console.log('Forecast result: ', result);
          setForecast(result);
        })
        .catch((err) => {
          console.log('Error!', err);
        });
    }

    return () => { };
  }, []);

  const handleClick = () => {
    setShowSnippet(!showSnippet);
  }

  return (
    <div className="forecast-tiles" onClick={handleClick}>
      {
        forecast.properties?.periods &&
        forecast.properties.periods.map((period: IForecastPeriod) =>
          <ForecastTile
            key={`${props.coordinate!.latitude}-${props.coordinate!.longitude}-${currentKey++}`}
            title={period.name}
            url={period.icon}
            snippet={period.shortForecast}
            showSnippet={showSnippet}
            temp={period.temperature}
            tempUnit={period.temperatureUnit}
            isDaytime={period.isDaytime}
          />
        )
      }
    </div>
  );
}