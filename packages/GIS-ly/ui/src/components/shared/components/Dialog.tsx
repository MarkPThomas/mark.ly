import { ReactNode } from "react";
import styled from "styled-components";

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
  align-items: center;
  // max-width: 25rem;
  // max-height: 18rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1),
    0px 8px 8px -4px rgba(16, 24, 40, 0.04);
  transition: all 0.5s ease;
  z-index: 1;
`;

const DialogMain = styled.section`
`;

const DialogTitle = styled.h2`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const FlowControl = styled.div`
  max-width: 25rem;
  max-height: 18rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DialogChildren = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DialogButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const CancelButton = styled.button`
  // Cancel button styles
`;

const CloseButton = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  transform: translate(-80%, 0%);
  font: bold 14px 'Lucida Console', Monaco, monospace;
  &:hover {
    cursor: pointer;
    color: gray;
  }
`;

type DialogButtonProps = {
  label: string;
  callback: () => void;
};

type DialogButtonsProps = DialogButtonProps[];

type DialogProps = {
  buttons?: DialogButtonsProps;
  children?: ReactNode;
  hasCancelButton?: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
};

let buttonKey = 0;

export default ({
  buttons,
  children,
  hasCancelButton,
  setShowDialog,
  title
}: DialogProps) => {
  return (
    <Dialog onClick={(e) => e.stopPropagation()}>
      <DialogMain>
        <DialogTitle>{title}</DialogTitle>
        <FlowControl>
          <DialogChildren>
            {children}
          </DialogChildren>
        </FlowControl>
        <br />
        <DialogButtons>
          {buttons ? buttons.map((button) =>
            <button
              key={`button-${buttonKey++}`}
              onClick={button.callback}
            >
              {button.label}
            </button>
          ) : null}
          {hasCancelButton ?
            <CancelButton onClick={() => setShowDialog(false)} >
              Cancel
            </CancelButton>
            : null}
        </DialogButtons>
        {!hasCancelButton ?
          <CloseButton onClick={() => setShowDialog(false)}>
            x
          </CloseButton>
          : null}
      </DialogMain>
    </Dialog>
  );
}
