
export type UndoControlProps = {

}

export function UndoControl({ }: UndoControlProps) {
  const handleClick = () => {
    console.log('Undo!')
  }

  return (
    <a className="split-control" href="#"
      title="Undo"
      aria-label="Undo"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Undo</span>
    </a>
  );
}