import { Incrementor } from '../../Incrementor';

export const CamItem = (props) => {

  const handleQuantityChange = (e) => {
    console.log(`Quantity changed! You now have ${e.target.value} of #${props.cam.size} cams`);
    const updatedCam = props.cam;
    updatedCam.quantity = parseInt(e.target.value);
    props.onCamChange(updatedCam);
  };

  const cam = props.cam;
  const camUrl = cam.url ? cam.url : './img/rackly_logo-32x32.png';
  if (props.isChangeable && !props.cam.quantity) {
    props.cam.quantity = 0;
  }

  return (
    <div className="cam-item">
      {props.isChangeable &&
        <Incrementor onInput={handleQuantityChange} quantity={props.cam.quantity} />}
      <div className="cam-size">#{cam.size}</div>
      <div className="cam-color">({cam.color})</div>
      <div className="cam-image">
        <img src={camUrl} />
      </div>
    </div>
  );
}