import { CamItem } from './CamItem';

export const CamList = (props) => {
  const cams = props.cams;
  return (
    <div className="items-list">
      {cams.map(cam => (
        <CamItem
          key={cam._id}
          cam={cam}
          isChangeable={props.isChangeable}
          onCamChange={props.onCamChange}
        />
      ))}
    </div>
  );
}