export type SplitControlProps = {
  cb?: () => void;
}

export function SplitControl({ cb }: SplitControlProps) {

  const handleClick = () => {
    console.log('Split!');
  }

  const handleMouseOver = () => {
    console.log('Tickle tickle!')
  }

  return (
    <a className="split-control"
      href="#"
      title="Split Operations"
      aria-label="Split Operations"
      aria-disabled="false"
      role="button"
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      <span aria-hidden="true">Split</span>
    </a>
  );
}