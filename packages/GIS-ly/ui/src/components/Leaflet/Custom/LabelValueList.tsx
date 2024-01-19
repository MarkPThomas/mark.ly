export type LabelValueProps = { label: string, value: string | number };

export function LabelValue({ label, value }: LabelValueProps) {
  return value ? <div className="label-value"><b>{label}:</b> {value}</div> : <></>
}