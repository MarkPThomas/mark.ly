import { Modal } from "../../../../shared/components/Modal";

export type ElevationsModalProps = {
  handleElevationApiDialog: (show: boolean) => void;
  handleGetElevation: () => Promise<void>;
  handleSmoothByElevationWithElevations: () => void;
}

export function ElevationsModal({
  handleElevationApiDialog,
  handleGetElevation,
  handleSmoothByElevationWithElevations
}: ElevationsModalProps) {
  return (
    <Modal
      setShow={handleElevationApiDialog}
      buttons={[{
        label: 'Fetch from API',
        callback: async () => {
          await handleGetElevation();
          handleSmoothByElevationWithElevations();
          handleElevationApiDialog(false);
        }
      }, {
        label: 'Use existing',
        callback: async () => {
          handleSmoothByElevationWithElevations();
          handleElevationApiDialog(false);
        }
      }, {
        label: 'Cancel',
        callback: () => {
          handleElevationApiDialog(false);
        }
      }
      ]}
      title={'Elevations'}
    >
      <p>Some Track Points are missing terrain elevations. <br />
        Stats may be off if using incomplete or GPS-recorded altitudes.</p>
    </Modal>
  );
}