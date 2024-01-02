import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../common/utils/stringFormatting";

export type ControlItemProps = {
  type: string;
  criteria: string;
  cb: () => void;
}

export function ControlItem({ cb, criteria: label, type }: ControlItemProps) {
  const className = `item-control`;

  const typeUpperFirst = toUpperFirstLetter(type);
  const criteriaUppers = toUpperFirstLetterOfEach(label);
  const title = `${typeUpperFirst} by ${criteriaUppers}`;

  return (
    <div className="leaflet-bar item">
      <a className={className}
        href="#"
        title={title}
        aria-label={title}
        aria-disabled="false"
        role="button"
        onClick={cb}
      >
        <span aria-hidden="true">{criteriaUppers}</span>
      </a>
    </div>
  );
}