import { useState } from "react";

export type ToggleButtonProps = {
  isToggled?: boolean,
  isEnabled?: boolean,
  cb?: () => void;
  values?: {
    on: any,
    off: any
  }
};

export function ToggleButton({ isToggled, isEnabled, values, cb }: ToggleButtonProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);

    if (cb) {
      cb();
    }
  };

  const value = values ? currentlyToggled ? values.on : values.off
    : currentlyToggled ? '^' : 'v';

  return <div onClick={handleClick} className={'toggle-button'}>{value}</div>;
}