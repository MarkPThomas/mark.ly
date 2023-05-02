export const Button = ({ message, onClick, cbArgs }) => {

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    cbArgs ? onClick(cbArgs) : onClick(event);
  }

  return <button type="button" onClick={handleClick}>{message}</button>
}