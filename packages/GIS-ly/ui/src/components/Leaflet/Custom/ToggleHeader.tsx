import { ToggleButton } from "./ToggleButton";

export type ToggleHeaderProps = {
  value: string
  isToggled?: boolean,
  isEnabled?: boolean,
  cb?: () => void;
};

export function ToggleHeader(props: ToggleHeaderProps) {
  return (
    <div className='toggle-header'>
      <div>
        <h2>{props.value}</h2>
      </div>
      <ToggleButton {...props} />
    </div>
  );
}