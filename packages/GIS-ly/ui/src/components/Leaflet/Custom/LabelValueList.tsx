export type LabelValueProps = { label: string, value: string | number };

export function LabelValue({ label, value }: LabelValueProps) {
  return <div><b>{label}:</b> {value}</div>
}