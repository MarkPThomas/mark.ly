
import { IGroupResponse } from '../../../../server/api/model';
import { Forecasts } from './Forecasts';

type Prop = {
  pointGroup: IGroupResponse;
};

export const Forecast = (props: Prop) => {

  return (
    <>
      <Forecasts pointGroup={props.pointGroup} />
    </>
  );
}