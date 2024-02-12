import { User } from './user/User';
import { Rack } from './rack/Rack';

export const BuildRack = (props) => {
  return (
    <div className="horizontal">
      <User user={props.user} />
      <Rack rack={props.user.rack} onRackChange={props.onRackChange} />
    </div>
  );
}