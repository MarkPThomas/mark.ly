export const Button = ({ message, onClick, cbArgs }) => {

  const handleClick = (e) => {
    e.preventDefault();
    cbArgs ? onClick(cbArgs) : onClick();
  }

  return <button type="button" onClick={handleClick}>{message}</button>
}