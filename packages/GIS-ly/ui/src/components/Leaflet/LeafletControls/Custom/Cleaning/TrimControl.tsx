
export type TrimControlProps = {
  cb?: () => void;
}

export function TrimControl({ cb }: TrimControlProps) {
  const handleClick = () => {
    console.log('Trim!')
    cb();
  }

  return (
    <a className="split-control" href="#"
      title="Trim Operations"
      aria-label="Trim Operations"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Trim</span>
    </a>
  );
}