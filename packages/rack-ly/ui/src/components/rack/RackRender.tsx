export const RackRender = (props) => {
  const cam = props.cam;
  let suffix = '';
  if (cam.quantity > 1) {
    suffix = 's';
  }
  return (
    <div>
      {cam.quantity} x #{cam.size} ({cam.lineName}{suffix})
    </div>
  );
}