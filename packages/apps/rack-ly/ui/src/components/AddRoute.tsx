import { User } from './user/User';
import { AreaList } from './routes/AreaList';

export const AddRoute = (props) => {
  return (
    <div className="horizontal">
      <User user={props.user} />
      <AreaList onRouteChange={props.onRouteChange} />
    </div>
  );
}