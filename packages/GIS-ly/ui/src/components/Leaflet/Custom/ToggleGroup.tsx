import { ReactNode, useState } from "react";
import { ToggleHeader, ToggleHeaderProps } from "./ToggleHeader";
import React from "react";

export type ToggleGroupProps = {
  children: ReactNode[];
  level?: number;
} & ToggleHeaderProps;

export function ToggleGroup(props: ToggleGroupProps) {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const { children, level } = props;

  const handleToggleClick = () => {
    setShowChildren(!showChildren);
  };

  let nextLevel = level ? level + 1 : undefined;
  const childProps = {
    ...props,
    level: nextLevel,
    cb: handleToggleClick
  }

  return (
    <div>
      <ToggleHeader {...childProps} />
      {showChildren ? children.map((child, index) =>
        <div key={index + Date()}>
          {/* <React.Fragment key={index + Date()}> */}
          {child}
          {/* </React.Fragment> */}
        </div>
      ) : null}
    </div>
  )
}