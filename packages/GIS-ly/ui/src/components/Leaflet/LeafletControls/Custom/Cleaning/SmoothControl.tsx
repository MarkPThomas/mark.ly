
export type SmoothControlProps = {
  cb?: () => void;
}

export function SmoothControl({ cb }: SmoothControlProps) {
  const handleClick = () => {
    console.log('Smooth!')
  }

  return (
    <a className="split-control" href="#"
      title="Smooth Operations"
      aria-label="Smooth Operations"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Smooth</span>
    </a>
  );
}