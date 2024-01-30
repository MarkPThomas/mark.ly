import styled from 'styled-components';

const S = {
  LabelValue: styled.div`
    font-size: 0.75em;
  `
};

export type LabelValueProps = { label: string, value: string | number };

export function LabelValueEntry({ label, value }: LabelValueProps) {
  return value
    ?
    <S.LabelValue>
      <b>{label}:</b> {value}
    </S.LabelValue>
    : <></>
}