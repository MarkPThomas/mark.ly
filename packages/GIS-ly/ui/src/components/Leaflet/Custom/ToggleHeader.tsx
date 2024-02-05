import classnames from "classnames";

import styles from "./ToggleHeader.module.css";

import { ArrowVerticalToggleIcon } from '../../shared/components/Icons/ArrowVerticalToggleIcon';

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
      <CustomTag as={CustomTag} className={className}>{props.value}</CustomTag>
      <ArrowVerticalToggleIcon {...childProps} />
    </div>
  );
}