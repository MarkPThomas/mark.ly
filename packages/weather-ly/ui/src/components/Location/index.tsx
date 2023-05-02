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
import { Point } from './Point';

type propsType = {
  points: IPointResponse[];
  pointGroup: IGroupResponse;
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (groupId: string) => void;
  addPointsHandler: (point: IPointResponse) => void;
}

export const Location = (props: propsType) => {

  return (
    <>
      <a href="/">Home</a>
      <h1>Add new forecast location:</h1>
      <PointEditor clickHandler={props.addPointsHandler} />
      <h2>All points: </h2>
      {
        props.points.map(point =>
          <div className="pt-items">
            <Point
              point={point}
              pointGroups={props.pointGroups}
              forecastGroupSelectionHandler={props.forecastGroupSelectionHandler}
            />
          </div>
        )
      }
    </>
  )
}