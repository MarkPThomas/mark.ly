import { useState } from "react";
import { CleanHeader } from "./CleanHeader";
import { SmoothControl } from "./SmoothControl";
import { SplitControl } from "./SplitControl";
import { TrimControl } from "./TrimControl";

export type CleaningControlProps = {
  cbTrim?: () => void;
  cbSplit?: () => void;
  cbSmooth?: () => void;
}

export function CleaningControl(props: CleaningControlProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);
  };

  return (
    <div className="leaflet-bar cleaning-control">
      <div>{<CleanHeader cb={handleClick} />}</div>
      {currentlyToggled ?
        <>
          <div>{<TrimControl cb={props.cbTrim} />}</div>
          <div>{<SplitControl cb={props.cbSplit} />}</div>
          <div>{<SmoothControl cb={props.cbSmooth} />}</div>
        </> : null
      }
    </div>
  )
}