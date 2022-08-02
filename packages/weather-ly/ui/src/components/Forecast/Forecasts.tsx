import { IGroupResponse } from "../../../../server/api/model";
import ErrorBoundary from '../../shared/components/ErrorBoundary';

import { ForecastTiles } from "./ForecastTiles";

type Prop = {
  pointGroup: IGroupResponse;
};

export const Forecasts = (props: Prop) => {
  // TODO: Save round of fetched data to JSON file for tests (manual & later unit)
  // TODO: With above, also cache API data fetched for session (clear @ some interval/time of day when NOAA changes)

  // TODO: Fetching of data should be done up here, as forecast points need to be trimmed
  //  First by min of 'This Afternoon' and 'Tonight', then by total length
  // Patterns seem to be: 'This Afternoon' and 'Tonight'(or some others) and then {day name} | {day name} Night
  // Maybe make a separate group call for this on the server end rather than having logic in tsx files...

  // TODO: Make title clickable to select another group to display
  // TODO: Make horizontal scroll bars or toggle arrows
  return (
    <div className="forecast-group">
      <h1>{props.pointGroup.name} Forecasts</h1>
      {
        props.pointGroup?.points?.map(forecastPoint => {
          return (
            <div className="forecast-group-point">
              <div className="forecast-group-header">
                <h2>{forecastPoint.name}</h2>
                <div>
                  (<a href="/hourly">Forecast Hourly</a> |  <a href="/gridData">Forecast Grid</a>)
                </div>
              </div>
              <ErrorBoundary>
                <ForecastTiles key={forecastPoint.pointId} coordinate={forecastPoint} />
              </ErrorBoundary>
            </div>
          );
        })
      }
    </div>
  )
};