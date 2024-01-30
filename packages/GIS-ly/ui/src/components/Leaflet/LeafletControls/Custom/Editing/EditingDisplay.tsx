import styled from "styled-components";

const EditingLabel = styled.div`
  background-color: yellow;
  border: 1px solid black;
  white-space: nowrap;
  padding-left: 5px;
  padding-right: 5px;
`;


export function EditingDisplay() {
  return (
    <EditingLabel>Editing to be added in next version</EditingLabel>
  );
}