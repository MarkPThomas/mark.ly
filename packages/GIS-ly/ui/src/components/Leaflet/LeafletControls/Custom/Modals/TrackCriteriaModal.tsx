import { ITrackCriteria } from "../../../../../model/GIS/settings";
import { Modal } from "../../../../shared/components/Modal";
import { TrackCriteria } from "../../../Custom/Settings/TrackCriteria";

export type TrackCriteriaModalProps = {
  handleShow: React.Dispatch<React.SetStateAction<boolean>>;
  trackCriteria: ITrackCriteria;
  trackCriteriaNormalized?: ITrackCriteria;
}

export function TrackCriteriaModal({
  handleShow,
  trackCriteria,
  trackCriteriaNormalized,
}: TrackCriteriaModalProps) {
  return (
    <Modal
      setShow={handleShow}
      buttons={[]}
      title={'Track Criteria'}
    >
      <div className="stats-container">
        {trackCriteria ?
          <TrackCriteria
            criteria={trackCriteria}
            title={"Specified"}
            level={3}
          /> : null
        }
        {trackCriteriaNormalized ?
          <TrackCriteria
            criteria={trackCriteriaNormalized}
            title={"Normalized"}
            level={3}
          /> : null
        }
      </div>
    </Modal>
  );
}