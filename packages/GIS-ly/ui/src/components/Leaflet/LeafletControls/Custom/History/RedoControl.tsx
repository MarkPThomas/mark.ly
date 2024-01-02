
export type RedoControlProps = {

}

export function RedoControl({ }: RedoControlProps) {
  const handleClick = () => {
    console.log('Redo!')
  }

  return (
    <a className="split-control" href="#"
      title="Redo"
      aria-label="Redo"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Redo</span>
    </a>
  );
}