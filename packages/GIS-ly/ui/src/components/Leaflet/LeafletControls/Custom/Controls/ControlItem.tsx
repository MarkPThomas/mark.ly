import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

export type ControlItemProps = {
  cb: () => void;
  criteria: string;
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  showLabelWithIcon?: boolean;
  title?: string;
  type: string;
}

export function ControlItem({
  cb,
  criteria,
  iconSvg,
  isDisabled,
  showLabelWithIcon,
  title,
  type,
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
        {(showLabelWithIcon && iconSvg) ?
          <span aria-hidden="true" className="icon-label">{iconSvg}{criteriaUppers}</span>
          :
          iconSvg ?? <span aria-hidden="true">{criteriaUppers}</span>
        }
      </a>
    </div>
  );
}