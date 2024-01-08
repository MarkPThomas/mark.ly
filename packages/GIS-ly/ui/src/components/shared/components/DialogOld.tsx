import { useEffect, useRef } from 'react';
import './dialog.css';

export type DialogProps = {
  isOpen: boolean;
  children: any;
}

export default ({ isOpen, children }: DialogProps) => {
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
      <section className="dialog-main">
        {children}
      </section>
    </dialog>
  );
}