import { useEffect, useState } from 'react';
import { Point, GridPoint } from '../../../../server/api/forecast'

export const Forecast = (props) => {
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    Point.getForecast({ latitude: 39.5883597956832, longitude: -105.6434294488281 })
      // GridPoint.getForecast({ office: 'BOU', gridX: 39, gridY: 55 })
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