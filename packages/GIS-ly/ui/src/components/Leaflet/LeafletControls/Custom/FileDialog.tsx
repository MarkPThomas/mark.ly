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
        <p>Warning! A track is already loaded!</p>
        <p>For the selected Track, do you want to:</p>
      </div>
      <br />
      <div className="modal-dialog-buttons">
        <button onClick={() => {
          if (cbYes) {
            cbYes();
          }
        }}>
          Add Track to Scene
        </button>
        <button onClick={() => {
          if (cbNo) {
            cbNo();
          }
        }}>
          Replace Tracks in Scene
        </button>
        <button onClick={() => {
          if (cbNo) {
            cbNo();
          }
        }}>
          Cancel
        </button>
      </div>
    </ModalDialog>
  );
}