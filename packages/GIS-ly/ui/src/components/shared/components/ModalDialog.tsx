import { useEffect, useRef } from 'react';
import './modal.css';

export type ModalDialogProps = {
  isOpen: boolean;
  children: any;
}

export default function ModalDialog({ isOpen, children }: ModalDialogProps) {
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

  return (
    <dialog ref={ref}>
      <section className="modal-main">
        {children}
      </section>
    </dialog>);
}