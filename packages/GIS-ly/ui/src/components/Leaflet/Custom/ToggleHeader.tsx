import classnames from "classnames";

import styles from "./ToggleHeader.module.css";

import { ToggleIcon } from '../../shared/components/Icons/ToggleIcon';

export type ToggleHeaderProps = {
  value: string;
  level?: number;
  isToggled?: boolean;
  isEnabled?: boolean;
  cb?: () => void;
  className?: string;
};

export function ToggleHeader(props: ToggleHeaderProps) {
  const className = classnames([
    styles.title,
    props.className
  ]);

  const childProps = { ...props };
  delete childProps.className;

  const CustomTag = props.level ? `h${props.level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <div className={styles.header}>
      <CustomTag className={className}>{props.value}</CustomTag>
      <ToggleIcon {...childProps} />
    </div>
  );
}