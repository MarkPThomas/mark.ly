import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../common/utils/stringFormatting";

export type ControlItemProps = {
  type: string;
  criteria: string;
  cb: () => void;
  isDisabled?: boolean;
}

export function ControlItem({ cb, criteria: label, type, isDisabled }: ControlItemProps) {
  const className = `item-control
    ${isDisabled ? ` disabled` : ''}`;

  const typeUpperFirst = toUpperFirstLetter(type);
  const criteriaUppers = toUpperFirstLetterOfEach(label);
  const title = `${typeUpperFirst} by ${criteriaUppers}`;

  const handleClick = () => {
    if (!isDisabled && cb) {
      cb();
    }
  }

  return (
    <div className="leaflet-bar item">
      <a className={className}
        href="#"
        title={title}
        aria-label={title}
        aria-disabled="false"
        role="button"
        onClick={handleClick}
      >
        <span aria-hidden="true">{criteriaUppers}</span>
      </a>
    </div>
  );
}