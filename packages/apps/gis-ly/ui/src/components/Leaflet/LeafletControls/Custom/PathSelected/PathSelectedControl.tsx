import { Track } from "../../../../../../../../libraries/gis/src";

import styles from './PathSelectedControl.module.css';

export type PathSelectedControProps = {
  currentTrack: Track,
  tracksValues: Track[],
  handleTrackSelection: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PathSelectedControl({
  currentTrack,
  tracksValues = [],
  handleTrackSelection
}: PathSelectedControProps) {
  return (
    <div className={styles.container}>
      {tracksValues.length > 1 ?
        <div className={styles.control}>
          <label htmlFor="tracks-selection"><h2>Selected Track:</h2></label>
          <select name="tracks" id="tracks-selection" value={currentTrack.id} onChange={handleTrackSelection}>
            {
              tracksValues.map((track) =>
                <option value={track.time} key={track.time}>{track.name}</option>
              )
            }
          </select>
        </div>
        :
        <h2>Selected Track: {currentTrack.name}</h2>
      }
    </div>
  );
}