import styled from "styled-components";

const S = {
  PathGraphDisplay: styled.div`
    background-color: yellow;
    border: 1px solid black;
    white-space: nowrap;
    padding-left: 5px;
    padding-right: 5px;
  `
};

export function PathGraphDisplay() {
  return (
    <S.PathGraphDisplay>
      Track Graph to be added in next version
    </S.PathGraphDisplay>
  );
}