
export type EditControlProps = {

}

export function EditControl({ }: EditControlProps) {
  const handleClick = () => {
    console.log('Edit!')
  }

  return (
    <a className="split-control" href="#"
      title="Edit Operations"
      aria-label="Edit Operations"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Edit</span>
    </a>
  );
}