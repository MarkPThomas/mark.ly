import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../shared/components/ErrorBoundary';

import { Forecasts as ForecastsApi } from '../../api';
import { IGroupResponse } from "../../../../server/api/model";

import { ForecastTiles } from "./ForecastTiles";

type Prop = {
  pointGroup: IGroupResponse;
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (e) => void;
};

export const Forecasts = (props: Prop) => {
  const [groupForecasts, setGroupForecasts] = useState(props.pointGroup);
  useEffect(() => {
    const updatedGroupForecasts = { ...groupForecasts };
    console.log('props.pointGroup: ', props.pointGroup);
    console.log('updatedGroupForecasts: ', updatedGroupForecasts);
    if (Object.keys(updatedGroupForecasts).length) {
      console.log('Getting forecasts!');
      // TODO: Determine how grids should be stored in data. Below is partial implementation of premature optimization.
      //    Point ID needs to be associated with forecast, so either assumed all coord or all grid. Mixed case a lot more work & might not apply.
      // const gridIds = [];
      // const gridXs = [];
      // const gridYs = [];

      const latitudes = [];
      const longitudes = [];
      updatedGroupForecasts.points?.forEach(point => {
        if (point.gridId) {
          console.log('Need to get forecasts by gridId!');
          // TODO: ByGrid
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
      // TODO: ByGrid
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const id = e.target.value;
    props.forecastGroupSelectionHandler(id);
    navigate('/weekly');
  }

  let key = 0;
  return (
    <div className="forecast-group">
      <select id="groups" name="groups" onChange={handleChange} value={groupForecasts.groupId}>
        {
          props.pointGroups.map(pointGroup =>
            <option key={String(pointGroup.groupId)} value={pointGroup.groupId}>
              {pointGroup.name}
            </option>
          )
        }
      </select>
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