import { useNavigate } from 'react-router-dom';

import {
  IGroupResponse
} from '../../../../server/api/model';

type propsType = {
  pointGroups: IGroupResponse[];
  forecastGroupSelectionHandler: (id: string) => void;
}

export const ForeCastSelector = (props: propsType) => {
  console.log('pointGroups: ', props.pointGroups);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const id = event.currentTarget.parentElement!.id;
    props.forecastGroupSelectionHandler(id);
    navigate('/weekly');
  }

  return (
    <>
      <a href="/">Home</a>
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
          <a href="/weekly">Weekly-Forecast Carousel - Static Data</a><br />
          <a href="/location">Forecast Location Editor</a><br />
          <a href="/group">Forecast Group Editor</a>
        </div>
      </div>
    </>
  );
};