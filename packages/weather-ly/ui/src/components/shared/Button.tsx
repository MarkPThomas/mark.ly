export const Button = ({ message, onClick, label }) => {

  const handleClick = (e) => {
    e.preventDefault();
    onClick(label);
  }

  return <button type="button" onClick={handleClick}>{message}</button>
}