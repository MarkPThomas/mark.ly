import './ControlCenter.css';

export type ControlCenterProps = {
  position: "top" | "bottom";
  children?: React.ReactNode;
}

export function ControlCenter({
  position = "top",
  children
}: ControlCenterProps) {
  const className = `${position}-center control`;

  return (
    <div className={className}>
      {children}
    </div>
  );
}