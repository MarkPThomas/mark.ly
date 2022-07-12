import { useEffect, useState } from 'react';
import { Point } from '../../../../server/api/forecast'

export const ForecastHourly = (props) => {
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    Point.getForecastHourly({ latitude: 39.5883597956832, longitude: -105.6434294488281 })
      .then(result => setForecast(result))
      .catch((err) => {
        console.log('Error!', err);
      });
    return () => { };
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify(forecast, null, 2)}
      </pre>
    </div>
  );
}