import { useEffect, useState } from 'react';
import ErrorBoundary from '../../shared/components/ErrorBoundary';

import { Forecasts as ForecastsApi } from '../../api';
import { IGroupResponse } from "../../../../server/api/model";

import { ForecastTiles } from "./ForecastTiles";

type Prop = {
  pointGroup: IGroupResponse;
};

export const Forecasts = (props: Prop) => {
  const [groupForecasts, setGroupForecasts] = useState(props.pointGroup);
  useEffect(() => {
    // const pointGroup = props.pointGroup;
    const updatedGroupForecasts = { ...groupForecasts };
    console.log('props.pointGroup: ', props.pointGroup);
    console.log('updatedGroupForecasts: ', updatedGroupForecasts);
    if (Object.keys(updatedGroupForecasts).length) {
      console.log('Getting forecasts!');
      // TODO: Determine how grids should be stored in data. Below is partial implementation of premature optimization.
      //    Point ID needs to be associated with forcast, so either assumed all coord or all grid. Mixed case a lot more work & might not apply.
      // const gridIds = [];
      // const gridXs = [];
      // const gridYs = [];

      const latitudes = [];
      const longitudes = [];
      updatedGroupForecasts.points?.forEach(point => {
        if (point.gridId) {
          console.log('Need to get forecasts by gridId!');
          // gridIds.push(point.gridId);

          // gridXs.push(point.gridX);
          // gridYs.push(point.gridY);
        } else {
          console.log('Getting forecasts by coords');
          latitudes.push(point.latitude);
          longitudes.push(point.longitude);
        }
      })

      console.log('Getting forecasts for group:', updatedGroupForecasts.name);
      // const results = await Promise.all([
      //   ForecastsApi.getForecastsByGrids(gridIds, gridXs, gridYs),
      //   ForecastsApi.getForecasts(latitudes, longitudes)
      // ]);

      // console.log('Forecast grid results: ', results[0].length);
      // console.log('Forecast coord results: ', results[1].length);
      // const forecasts = results[0].concat(results[1]);

      ForecastsApi.getForecasts(latitudes, longitudes)
        .then(result => {
          console.log('Forecast coord results: ', result.length);
          // updatedGroupForecasts.forecasts = new Map();
          updatedGroupForecasts.forecasts = {};
          for (let i = 0; i < updatedGroupForecasts.points.length; i++) {
            updatedGroupForecasts.forecasts[updatedGroupForecasts.points[i].pointId] = result[i];
          };
          console.log('updatedGroupForecasts 2: ', updatedGroupForecasts);
          setGroupForecasts(updatedGroupForecasts);
        });
      // setForecasts(forecasts);
    }

    return () => { };
  }, []);

  // TODO: Make title clickable to select another group to display
  // TODO: Make horizontal scroll bars or toggle arrows

  // TODO: With fetched api data, also cache API data fetched for session (clear @ some interval/time of day when NOAA changes)

  // TODO: Future improvements are to have a parent component state of timestamp of forecast last fetched for points,
  //    and use this to determine which points to update forecasts for

  let key = 0;
  return (
    <div className="forecast-group">
      <h1>{groupForecasts.name} Forecasts</h1>
      {
        groupForecasts.forecasts &&
        Object.keys(groupForecasts.forecasts).length &&
        groupForecasts?.points?.map(forecastPoint => {
          console.log('forecastPoint: ', forecastPoint);
          return (
            <div key={key++} className="forecast-group-point">
              <div className="forecast-group-header">
                <h2>{forecastPoint.name}</h2>
                <div>
                  (<a href="/hourly">Forecast Hourly</a> |  <a href="/gridData">Forecast Grid</a>)
                </div>
              </div>
              <ErrorBoundary>
                <ForecastTiles
                  key={forecastPoint.pointId}
                  coordinate={forecastPoint}
                  forecast={groupForecasts.forecasts[forecastPoint.pointId]}
                />
              </ErrorBoundary>
            </div>
          );
        })
      }
    </div>
  )
};