import { RouteItem } from '../routes/RouteItem';
import { RackRender } from '../rack/RackRender';

export const User = (props) => {
  const user = props.user;
  return (
    <div className="user">
      <h1>{user.userName}</h1>
      <div className="user-routes">
        <h2>Routes Selected:</h2>
        {user.routes.map(route => (
          <RouteItem
            key={route.id}
            route={route}
            isSelectable={false}
          />
        ))}
        <hr />
      </div>
      <div className="user-rack-needed">
        <h2>Rack Needed:</h2>
        <h3>Cams:</h3>
        {user.rackNeeded.cams && user.rackNeeded.cams.map(cam => (
          <RackRender key={cam._id + "1"} cam={cam} />
        ))}
        <h3>Ropes:</h3>
        <hr />
      </div>
      <div className="user-rack">
        <h2>Rack Available:</h2>
        <h3>Cams:</h3>
        {user.rack.cams && user.rack.cams.map(cam => (
          <RackRender key={cam._id + "2"} cam={cam} />
        ))}
        <h3>Ropes:</h3>
        <hr />
      </div>
      <div className="user-rack-short">
        <h2>Rack Short:</h2>
        <h3>Cams:</h3>
        {user.rackShort.cams && user.rackShort.cams.map(cam => (
          <RackRender key={cam._id + "3"} cam={cam} />
        ))}
        <h3>Ropes:</h3>
        <hr />
      </div>
    </div>
  );
};