import { useEffect, useState } from 'react';
import { Button } from "../../shared/components/Button";

import {
  IPointResponse,
  IGroupResponse
} from '../../../../server/api/model';
import { ErrorBoundary } from "../../shared/components/ErrorBoundary";
import { PointEditor } from '../../shared/components/PointEditor';
import { ForecastTiles } from "../Forecast/ForecastTiles";
import { DropList } from '../../shared/components/DropList';

type propsType = {
  points: IPointResponse[];
  pointGroup: IGroupResponse;
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (e) => void;
  addPointsHandler: (point: IPointResponse) => void;
}

export const Location = (props: propsType) => {
  const [currentPoint, setCurrentPoint] = useState({} as IPointResponse);
  const [showForecast, setShowForecast] = useState(false);
  const [groupForecasts, setGroupForecasts] = useState(props.pointGroup);


  useEffect(() => {

    return () => { };
  }, []);

  const handleAddToGroup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {

  }

  const handleShowForecast = () => {
    setShowForecast(!showForecast);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const id = event.target.value;
    console.log('Group ID:', id);
    // props.forecastGroupSelectionHandler(id);
  }

  return (
    <>
      <a href="/">Home</a>
      <h1>Add new forecast location:</h1>
      <PointEditor clickHandler={props.addPointsHandler} />
      <div>
        <DropList
          items={props.pointGroups.map(pointGroup => { return { value: pointGroup.groupId, name: pointGroup.name } })}
          name={'point-groups'}
          keyPrefix={'point-groups'}
          useNoneSelectedValue={true}
          labelText={'Group:'}
          id={'point-groups'}
          onChange={handleChange}
        />
        {/* <label htmlFor="groups">Add to group:</label>
        <select id="groups" name="groups" onChange={handleChange} value={groupForecasts.groupId}>
          <option value="">-</option>
          {
            props.pointGroups.map(pointGroup =>
              <option key={String(pointGroup.groupId)} value={pointGroup.groupId}>
                {pointGroup.name}
              </option>
            )
          }
        </select> */}
        <Button message='Add' onClick={handleAddToGroup} cbArgs={undefined} />
      </div>
      <Button message='See Forecast' onClick={handleShowForecast} cbArgs={undefined} />
      {
        showForecast &&
        <ErrorBoundary>
          <ForecastTiles
            key={currentPoint.pointId}
            coordinate={currentPoint}
          />
        </ErrorBoundary>
      }
      <h2>All points: </h2>
      {
        props.points.map(point =>
          <div>
            <a href="/" key={point.latitude.toString() + point.longitude.toString()}>{point.name}</a>: {point.latitude}, {point.longitude}<br />
          </div>
        )
      }
    </>
  )
}