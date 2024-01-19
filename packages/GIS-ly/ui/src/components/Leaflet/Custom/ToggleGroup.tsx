import { ReactNode, useState } from "react";
import { ToggleHeader, ToggleHeaderProps } from "./ToggleHeader";

export type ToggleGroupProps = {
  children: ReactNode[];
  level?: number;
  id?: string;
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

  const itemProps = props.id ? { id: props.id } : {};

  return (
    <div className="toggle-group">
      <ToggleHeader {...childProps} />
      {showChildren ? children.map((child, index) =>
        <div key={index + Date()} className="toggle-item" {...itemProps}>
          {child}
        </div>
      ) : null}
    </div>
  )
}