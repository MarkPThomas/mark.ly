export type Props = {
  message: string,
  onClick: (args: any[] | React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  cbArgs: any[]
}

export const Button = (props: Props) => {

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    props.cbArgs ? props.onClick(props.cbArgs) : props.onClick(event);
  }

  return <button type="button" onClick={handleClick}>{props.message}</button>
}