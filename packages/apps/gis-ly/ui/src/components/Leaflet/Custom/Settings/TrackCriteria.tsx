import { ITrackCriteria } from "@markpthomas/gis"

import { hashString } from 'common/utils';

import { ToggleGroup } from '../ToggleGroup';
import { TrackCriteriaActivity } from "./TrackCriteriaActivity"
import { TrackCriteriaGeneric } from "./TrackCriteriaGeneric"
import { TrackCriteriaUnits } from "./TrackCriteriaUnits"

import styles from './TrackCriteria.module.css';

export type TrackCriteriaProps = {
  criteria: ITrackCriteria
  title?: string;
  level?: number;
}

export function TrackCriteria({
  criteria,
  title = "Track Criteria",
  level = 2
}: TrackCriteriaProps) {
  const CustomTag = level ? `h${level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <div className={styles.trackCriteria}>
      <CustomTag className={styles.title}>{title}</CustomTag>
      <ToggleGroup value={'Units'} level={level} children={[<TrackCriteriaUnits key={Date()} units={criteria.units} />]} />

      {(criteria.cruft || criteria.split || criteria.noiseCloud || criteria.misc) ?
        <ToggleGroup value={'Generic'} level={level} children={[
          <TrackCriteriaGeneric
            key={Date()}
            cruft={criteria.cruft}
            split={criteria.split}
            noiseCloud={criteria.noiseCloud}
            misc={criteria.misc}
            level={level + 1}
          />]} />
        : null}

      {Object.keys(criteria.activities).length ?
        <ToggleGroup
          value={'Activities'}
          level={level}
          children={Object.values(criteria.activities).map(
            (activity) => <TrackCriteriaActivity key={hashString(JSON.stringify(activity))} activity={activity} level={level + 1} />
          )} />
        : null}
    </div>
  );
}