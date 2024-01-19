import { useState } from "react";
import { IGroupResponse, IPointResponse } from "../../../../server/api/model"
import { Button } from "../../shared/components/Button";
import { DropList } from "../../shared/components/DropList";
import { ErrorBoundary } from "../../shared/components/ErrorBoundary";
import { ForecastTiles } from "../Forecast/ForecastTiles";

type Props = {
  point: IPointResponse;
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (groupId: string) => void;
}

export const Point = (props: Props) => {
  // TODO: Get groups containing from server -> later DB query

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showForecast, setShowForecast] = useState(false);

  const handleAddToGroup = (event: any[] | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

  }

  const handleShowForecast = () => {
    console.log('Point clicked: ', props.point);
    setShowForecast(!showForecast);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const id = event.target.value;
    props.forecastGroupSelectionHandler(id);
  }

  return (
    <div className="pt-item" key={props.point.latitude.toString() + props.point.longitude.toString()}>
      <div className='pt-item-title' onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="pt-item-name">{props.point.name}</div>:&nbsp;<div className="pt-item-coords">{props.point.latitude},&nbsp;{props.point.longitude}</div>
      </div>
      {
        !isCollapsed &&
        <div>
          <hr />
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
            <Button message='Add' onClick={handleAddToGroup} cbArgs={undefined} />
            <Button message='Remove' onClick={handleAddToGroup} cbArgs={undefined} />
          </div>
          <Button message='See Containing Groups' onClick={() => { }} cbArgs={undefined} />
          <Button message='See Forecast' onClick={handleShowForecast} cbArgs={undefined} />
          {
            showForecast &&
            <ErrorBoundary>
              <ForecastTiles
                key={props.point.pointId}
                coordinate={props.point}
              />
            </ErrorBoundary>
          }
        </div>
      }
    </div>
  )
}