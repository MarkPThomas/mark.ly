import { useState } from "react";

export type CleanHeaderProps = {
  isToggled?: boolean,
  isEnabled?: boolean,
  cb?: () => void;
}

export function CleanHeader({ isToggled, isEnabled, cb }: CleanHeaderProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);
    console.log('Clean!')
    if (cb) {
      cb();
    }
  };

  const className = `header-control${currentlyToggled ? ' toggled' : ''}`;

  return (
    <a className={className} href="#"
      title="Clean Operations"
      aria-label="Clean Operations"
      aria-disabled="false"
      role="button"
      onClick={handleClick}>
      <span aria-hidden="true">Clean</span>
    </a>
  );
}