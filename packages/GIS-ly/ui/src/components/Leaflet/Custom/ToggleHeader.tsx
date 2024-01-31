import styled from 'styled-components';
import { ArrowVerticalToggleIcon } from '../../shared/components/Icons/ArrowVerticalToggleIcon';

const S = {
  ToggleHeader: styled.div`
    display: flex;
    padding-top: 0.5em;
    padding-bottom: 0.2em;
  `,
  HGeneric: styled.div`
    margin-top: 0;
    margin-bottom: 0;
    `
};

export type ToggleHeaderProps = {
  value: string;
  level?: number;
  isToggled?: boolean;
  isEnabled?: boolean;
  cb?: () => void;
};

export function ToggleHeader(props: ToggleHeaderProps) {
  const CustomTag = props.level ? `h${props.level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <S.ToggleHeader>
      <S.HGeneric as={CustomTag}>{props.value}</S.HGeneric>
      <ArrowVerticalToggleIcon {...props} />
    </S.ToggleHeader>
  );
}