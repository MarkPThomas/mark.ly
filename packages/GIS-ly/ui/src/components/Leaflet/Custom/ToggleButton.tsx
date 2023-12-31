import { useState } from "react";

export type ToggleButtonProps = {
  isToggled?: boolean,
  isEnabled?: boolean,
  cb?: () => void;
};

export function ToggleButton({ isToggled, isEnabled, cb }: ToggleButtonProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);

    if (cb) {
      cb();
    }
  };

  const value = currentlyToggled ? '^' : 'v';

  return <div onClick={handleClick} className={'toggle-button'}>{value}</div>;
}