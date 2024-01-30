import { ArrowVerticalToggleIcon } from '../../shared/components/Icons/ArrowVerticalToggleIcon';

import './ToggleHeader.css';

export type ToggleHeaderProps = {
  value: string;
  level?: number;
  isToggled?: boolean;
  isEnabled?: boolean;
  cb?: () => void;
};

export function ToggleHeader(props: ToggleHeaderProps) {
  const CustomTag = props.level ? `h${props.level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    <div className='toggle-header'>
      <CustomTag>{props.value}</CustomTag>
      <ArrowVerticalToggleIcon {...props} />
    </div>
  );
}