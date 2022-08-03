import { useNavigate } from 'react-router-dom';

import {
  IPointResponse,
  IGroupResponse
} from '../../../../server/api/model';

import { Button } from "../../shared/components/Button";

type propsType = {
  points: IPointResponse[];
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (e) => void
}

export const ForeCastSelector = (props: propsType) => {
  console.log('pointGroups: ', props.pointGroups);

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const id = e.target.parentNode.id;
    props.forecastGroupSelectionHandler(id);
    navigate('/weekly');
  }

  return (
    <>
      <div>
        <div>
          <h1>Forecast Groups</h1>
          <ul>
            {
              props.pointGroups.map(pointGroup => {
                const url = `/groupForecast/${pointGroup.groupId.toString()}`;

                return (
                  <li id={String(pointGroup.groupId)} key={pointGroup.groupId}>
                    <a href={'/weekly'} onClick={handleClick}>{pointGroup.name}</a>
                  </li>);
              })
            }
          </ul>
          <a href="/weekly">Weekly-Forecast Carousel</a>
        </div>
      </div>
      <div>
        <h1>Add new forecast location:</h1>
        <div>
          <input type="text" placeholder="Name"></input>
          <input type="text" placeholder="Latitude"></input>
          <input type="text" placeholder="Longitude"></input>
        </div>
        <div>
          <label htmlFor="groups">Add to group:</label>
          <select id="groups" name="groups">
            <option value="none">-</option>
            {
              props.pointGroups.map(pointGroup =>
                <option key={String(pointGroup.groupId)} value={pointGroup.groupId}>{pointGroup.name}</option>
              )
            }
          </select>
          <Button message='Add' onClick={undefined} cbArgs={undefined} />
        </div>
        <Button message='See Forecast' onClick={undefined} cbArgs={undefined} />
        <Button message='Create New Group' onClick={undefined} cbArgs={undefined} />
        <Button message='Edit Existing Group' onClick={undefined} cbArgs={undefined} />
        <div>
          <div>
            <input type="text" placeholder="Group Name"></input>
            <br />
            <label htmlFor="editGroup">Edit group:</label>
            <select id="editGroup" name="editGroup">
              <option value="none">-</option>
              {
                props.pointGroups.map(pointGroup =>
                  <option key={String(pointGroup.groupId)} value={pointGroup.groupId}>{pointGroup.name}</option>
                )
              }
            </select>
            <Button message='Edit' onClick={undefined} cbArgs={undefined} />
          </div>
          <br />
          <div>
            <label htmlFor="editGroup">Merge with group:</label>
            <select id="mergeGroup" name="mergeGroup">
              <option value="none">-</option>
              {
                props.pointGroups.map(pointGroup =>
                  <option key={String(pointGroup.groupId)} value={pointGroup.groupId}>{pointGroup.name}</option>
                )
              }
            </select>
            <Button message='Merge' onClick={undefined} cbArgs={undefined} />
          </div>
          <br />
          <div>
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
          </div>
        </div>
      </div>
    </>
  );
};