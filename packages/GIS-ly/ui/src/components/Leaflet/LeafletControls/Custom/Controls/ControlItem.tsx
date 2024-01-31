import styled from "styled-components";
import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

import './ControlItem.css';

// TODO: Before using these, solve:
// 2. Conditional classes or importing styled component for disabled button
const S = {
  ItemControl: styled.div`
    width: 100%;
    `,

  IconLabel: styled.span`
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      align-items: start;
      margin: 5px;
    `
};

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
          <S.IconLabel aria-hidden="true">{iconSvg}{criteriaUppers}</S.IconLabel>
          :
          iconSvg ?? <span aria-hidden="true">{criteriaUppers}</span>
        }
      </a>
    </div>
  );
}