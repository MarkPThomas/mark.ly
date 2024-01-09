import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../common/utils/stringFormatting";

export type ControlItemProps = {
  type: string;
  criteria: string;
  cb: () => void;
  isDisabled?: boolean;
  title?: string;
}

export function ControlItem({
  cb,
  criteria,
  type,
  isDisabled,
  title
}: ControlItemProps) {
  const className = `item-control
    ${isDisabled ? ` disabled` : ''}`;

  const typeUpperFirst = toUpperFirstLetter(type);
  const criteriaUppers = toUpperFirstLetterOfEach(criteria);
  const localTitle = `${typeUpperFirst} by ${criteriaUppers}`;

  const handleClick = () => {
    if (!isDisabled && cb) {
      cb();
    }
  }

  return (
    <div className="leaflet-bar item">
      <a className={className}
        href="#"
        title={title ?? localTitle}
        aria-label={title ?? localTitle}
        aria-disabled="false"
        role="button"
        onClick={handleClick}
      >
        <span aria-hidden="true">{criteriaUppers}</span>
      </a>
    </div>
  );
}