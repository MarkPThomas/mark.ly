import { User } from './user/User';

export const Home = (props) => {
  return (
    <div>
      Welcome Home!
      <div className="horizontal">
        <User user={props.user} />
      </div>
    </div>
  );
};