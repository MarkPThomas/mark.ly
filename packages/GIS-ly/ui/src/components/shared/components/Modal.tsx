import styled from "styled-components";
import Dialog, { DialogProps } from "./Dialog";

const Overlay = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(52, 64, 84, 0.6);
  backdrop-filter: blur(8px);
  animation: fadein 0.5s;
  z-index: 3000;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

type ModalProps = DialogProps;

export function Modal(props: ModalProps) {
  return (
    <Overlay onClick={() => props.setShow(false)}>
      <Dialog {...props} />
    </Overlay>
  );
}