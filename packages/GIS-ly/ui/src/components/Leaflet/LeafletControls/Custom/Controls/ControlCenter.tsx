import classnames from 'classnames';
import styles from './ControlCenter.module.css';

export type ControlCenterProps = {
  position: "top" | "bottom";
  children?: React.ReactNode;
}

export function ControlCenter({
  position = "top",
  children
}: ControlCenterProps) {

  const className = classnames([
    styles.control,
    styles.center,
    styles[position]
  ]);

  return (
    <div className={className}>
      {children}
    </div>
  );
}