export const Incrementor = (props) => {
  const quantity = props.quantity ? props.quantity : 0;
  return (
    <div className="incrementor">
      <form onInput={props.onInput}>
        <input type="number" name="quantity" min="0" max="50" defaultValue={quantity} />
      </form>
      x
    </div>
  );
};