import { useState } from 'react';
import classnames from 'classnames';

import styles from './ToggleIcon.module.css';

type Props = {
  cb?: () => void;
  isDisabled?: boolean;
  isToggled?: boolean;
};

export function ToggleIcon({
  isDisabled = false,
  isToggled = false,
  cb = null
}: Props) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);

    if (cb) {
      cb();
    }
  };

  const className = classnames([
    styles.toggleButton,
    { [styles.toggled]: currentlyToggled },
    { [styles.disabled]: isDisabled },
  ]);

  return (
    <button className={className} onClick={handleClick}>
      +
    </button>
  );
}