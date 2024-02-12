import { Button } from "../../shared/components/Button";

import {
  IPointResponse,
  IGroupResponse
} from '../../../../server/api/model';

type propsType = {
  points: IPointResponse[];
  pointGroups: IGroupResponse[];
}

export const Group = (props: propsType) => {
  return (
    <>
      <a href="/">Home</a>
      <h1>Forecast Locations</h1>
      <Button message='Add to Group' onClick={undefined} cbArgs={undefined} />
      <h2>All:</h2>
      <ul>
        {
          props.points.map(point => {
            const pointId = point.pointId.toString();
            return (
              <li key={pointId}>
                <input type="checkbox" id={pointId} name={pointId} value={pointId} />
                <label htmlFor={pointId}>{point.name}</label>
              </li>
            );
          })
        }
      </ul>
      <h2>In Group: {props.pointGroups[0]?.name}</h2>
      <ul>
        {
          props.pointGroups[0]?.points.map(point => {
            const pointId = point.pointId.toString();
            return (
              <li key={pointId}>
                <input type="checkbox" id={pointId} name={pointId} value={pointId} />
                <label htmlFor={pointId}>{point.name}</label>
              </li>
            );
          })
        }
      </ul>
    </>
  )
}