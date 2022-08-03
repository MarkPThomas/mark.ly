
import { IGroupResponse } from '../../../../server/api/model';
import { Forecasts } from './Forecasts';

type Prop = {
  pointGroup: IGroupResponse;
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (e) => void;
};

export const Forecast = (props: Prop) => {

  return (
    <>
      <a href="/">Home</a>
      <Forecasts
        pointGroup={props.pointGroup}
        pointGroups={props.pointGroups}
        forecastGroupSelectionHandler={props.forecastGroupSelectionHandler}
      />
    </>
  );
}