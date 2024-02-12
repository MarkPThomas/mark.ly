import { Incrementor } from '../../Incrementor';

export const RopeItem = (props) => {
  const handleQuantityChange = (e) => {
    console.log(`Quantity changed! You now have ${e.target.value} of ${props.rope.length} ${props.rope.lengthUnit} ropes`);
    const updatedRope = props.rope;
    updatedRope.quantity = parseInt(e.target.value);
    props.onRopeChange(updatedRope);
  };

  const rope = props.rope;
  const ropeUrl = rope.url ? rope.url : '';
  if (props.isChangeable && !props.rope.quantity) {
    props.rope.quantity = 0;
  }

  return (
    <div>
      <div className="rope-item">
        {props.isChangeable &&
          <Incrementor onInput={handleQuantityChange} quantity={props.rope.quantity} />}
        <div className="rope-identifier">{rope.manufacturer} - {rope.model}: </div>
        <div className="rope-length">{rope.length} {rope.lengthUnit}</div>
        <div className="rope-image">
          <img src={ropeUrl} />
        </div>
      </div>
    </div>
  );
};