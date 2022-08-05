import { Button } from "../../shared/components/Button";

import {
  IPointResponse,
  IGroupResponse
} from '../../../../server/api/model';

type propsType = {
  points: IPointResponse[];
  pointGroups: IGroupResponse[];
}

export const Location = (props: propsType) => {
  return (
    <>
      <a href="/">Home</a>
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
      </div>
    </>
  )
}