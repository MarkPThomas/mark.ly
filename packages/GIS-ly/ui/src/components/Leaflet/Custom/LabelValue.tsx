import styles from './LabelValue.module.css';

export type LabelValueProps = { label: string, value: string | number };

export function LabelValue({ label, value }: LabelValueProps) {
  return value
    ?
    <div className={styles.labelValue}>
      <b>{label}:</b> {value}
    </div>
    : null;
}