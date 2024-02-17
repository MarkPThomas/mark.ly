import { ITrackCriteria } from "@markpthomas/gis";

import { Modal } from "../../../../shared/components/Modal";
import { TrackCriteria } from "../../../Custom/Settings/TrackCriteria";

import style from './TrackCriteriaModal.module.css';

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
      <div className={style.container}>
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