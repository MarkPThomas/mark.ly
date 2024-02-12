import { Modal } from "../../../../shared/components/Modal";

export type TrackCriteriaModalProps = {
  handleFileReplaceDialog: (show: boolean) => void;
  swapTracks: () => Promise<void>;
  loadTrack: () => Promise<void>;
}

export function FileReplaceModal({
  handleFileReplaceDialog,
  swapTracks,
  loadTrack
}: TrackCriteriaModalProps) {
  return (
    <Modal
      setShow={handleFileReplaceDialog}
      buttons={[
        {
          label: 'Replace',
          callback: () => {
            console.log('Replace')
            // TODO: Handle case of re-selecting existing file after cancelling in this modal.
            // acceptCurrentFile(true);
            swapTracks();
            handleFileReplaceDialog(false);
          }
        }, {
          label: 'Merge',
          callback: () => {
            console.log('Merge')
            // TODO: Handle case of re-selecting existing file after cancelling in this modal.
            // TODO: Handle case of not reloading a prior loaded file. Maybe have a list of loaded names?
            // acceptCurrentFile(true);
            loadTrack();
            handleFileReplaceDialog(false);
          }
        }, {
          label: 'Cancel',
          callback: () => {
            console.log('Cancel')
            // TODO: Handle case of re-selecting existing file after cancelling here.
            // acceptCurrentFile(false);
            handleFileReplaceDialog(false);
          }
        }
      ]}
      title={'Warning!'}
    >
      <p>Tracks already exist.</p>
      <p>Please select from the following actions:</p>
    </Modal>
  );
}