// import styled from 'styled-components';
import classnames from "classnames";

import styles from "./ToggleHeader.module.css";

import { ArrowVerticalToggleIcon } from '../../shared/components/Icons/ArrowVerticalToggleIcon';

// const S = {
//   ToggleHeader: styled.div`
//     display: flex;
//     padding-top: 0.5em;
//     padding-bottom: 0.2em;
//   `,
//   HGeneric: styled.div`
//     margin-top: 0;
//     margin-bottom: 0;
//     `
// };

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

  const CustomTag = props.level ? `h${props.level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <div className={styles.header}>
      <CustomTag as={CustomTag} className={className}>{props.value}</CustomTag>
      <ArrowVerticalToggleIcon {...props} />
    </div>
  );
}