import { useEffect, useRef } from 'react';
import './modal.css';
import Dialog from './DialogOld';

export type ModalDialogProps = {
  isOpen: boolean;
  children: any;
  isModal?: boolean;
}

export default function ModalDialog({ isOpen, children, isModal }: ModalDialogProps) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  const className = `modal ${(isModal && isOpen) ? ` display-block` : ` display-none`}`;

  return (
    <div className={className}>
      <Dialog isOpen={isOpen} children={children} />
    </div>
  );
}