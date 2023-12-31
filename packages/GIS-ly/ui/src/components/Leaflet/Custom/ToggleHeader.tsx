import { ToggleButton } from "./ToggleButton";

export type ToggleHeaderProps = {
  value: string
  level?: number
  isToggled?: boolean,
  isEnabled?: boolean,
  cb?: () => void;
};

export function ToggleHeader(props: ToggleHeaderProps) {
  const CustomTag = props.level ? `h${props.level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <div className='toggle-header'>
      <div>
        <CustomTag>{props.value}</CustomTag>
      </div>
      <ToggleButton {...props} />
    </div>
  );
}