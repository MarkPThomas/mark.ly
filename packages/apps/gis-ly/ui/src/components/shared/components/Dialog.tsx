import { ReactNode } from "react";
import styled from "styled-components";

const S = {
  Dialog: styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    padding: 0 1rem 1rem 1rem;
    align-items: center;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1),
      0px 8px 8px -4px rgba(16, 24, 40, 0.04);
    transition: all 0.5s ease;
    z-index: 1;
  `,

  DialogMain: styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  `,

  DialogTitle: styled.h2`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  `,

  Icon: styled.img`
    // Icon styles
  `,

  Text: styled.div`
    // Text styles
  `,

  FlowControl: styled.div`
    max-width: 25rem;
    max-height: 18rem;
    overflow-y: auto;
    overflow-x: hidden;
  `,

  Button: styled.button`
    // Button styles
  `,

  CloseButton: styled.div`
    position: fixed;
    top: 0;
    right: 0;
    transform: translate(-80%, 0%);
    font: bold 14px 'Lucida Console', Monaco, monospace;
    &:hover {
      cursor: pointer;
      color: gray;
    }
  `,

  DialogChildren: styled.div``,
  DialogButtons: styled.div``,
  CancelButton: styled.div``,
};

S.DialogChildren = styled(S.DialogMain)`
  flex-direction: column;
`;

S.DialogButtons = styled(S.DialogMain)`
  flex-direction: row;
`;

S.CancelButton = styled(S.Button)`
  // Cancel button styles
`;

type DialogButtonProps = {
  label: string;
  callback: () => void;
};

type DialogButtonsProps = DialogButtonProps[];

export type DialogProps = {
  buttons?: DialogButtonsProps;
  children?: ReactNode;
  hasCancelButton?: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
};

let buttonKey = 0;

export default ({
  buttons,
  children,
  hasCancelButton,
  setShow,
  title
}: DialogProps) => {
  return (
    <S.Dialog onClick={(e) => e.stopPropagation()}>
      <S.DialogMain>
        <S.DialogTitle>{title}</S.DialogTitle>
        <S.FlowControl>
          <S.DialogChildren>
            {children}
          </S.DialogChildren>
        </S.FlowControl>
        <br />
        <S.DialogButtons>
          {buttons ? buttons.map((button) =>
            <S.Button
              key={`button-${buttonKey++}`}
              onClick={button.callback}
            >
              {button.label}
            </S.Button>
          ) : null}
          {hasCancelButton ?
            <S.CancelButton onClick={() => setShow(false)} >
              Cancel
            </S.CancelButton>
            : null}
        </S.DialogButtons>
        {!hasCancelButton ?
          <S.CloseButton onClick={() => setShow(false)}>
            x
          </S.CloseButton>
          : null}
      </S.DialogMain>
    </S.Dialog>
  );
}
