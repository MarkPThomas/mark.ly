import ModalDialog from "../../../shared/components/ModalDialog";

export type FileDialogProps = {
  isOpen: boolean;
  cbYes: () => void;
  cbNo: () => void;
}

export function FileDialog({ isOpen, cbYes, cbNo }: FileDialogProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
    >
      <div className="modal-dialog-message">
        <p>Warning!</p>
        <p>Loading a new Track will replace the existing Tracks.</p>
        <p>Do you want to continue loading the new Track?</p>
      </div>
      <br />
      <div className="modal-dialog-buttons">
        <button onClick={() => {
          if (cbYes) {
            cbYes();
          }
        }}>
          Yes
        </button>
        <button onClick={() => {
          if (cbNo) {
            cbNo();
          }
        }}>
          No
        </button>
      </div>
    </ModalDialog>
  );
}