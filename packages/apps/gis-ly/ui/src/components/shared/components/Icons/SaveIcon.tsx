import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  innerColor?: string;
  outlineColor?: string
  hoverStroke?: string;
  isDisabled?: boolean;
};

export function SaveIcon({
  height = "24px",
  width = "24px",
  color = "black",
  stroke = "none",
  strokeWidth = "1",
  innerColor = "#000000",
  outlineColor = "black",
  hoverStroke = "green",
  isDisabled = false,
  ...props
}: Props) {

  const [hover, setHover] = useState<boolean>(false);

  const translate = (hover && !isDisabled) ? 'translate(-154, -517)' : 'translate(-152, -515)';
  const pathD = (hover && !isDisabled)
    ? 'M172,522 C172,521.447 172.448,521 173,521 C173.552,521 174,521.447 174,522 L174,526 C174,526.553 173.552,527 173,527 C172.448,527 172,526.553 172,526 L172,522 L172,522 Z M163,529 L177,529 C177.552,529 178,528.553 178,528 L178,517 L162,517 L162,528 C162,528.553 162.448,529 163,529 L163,529 Z M182,517 L180,517 L180,529 C180,530.104 179.104,531 178,531 L162,531 C160.896,531 160,530.104 160,529 L160,517 L158,517 C155.791,517 154,518.791 154,521 L154,545 C154,547.209 155.791,549 158,549 L182,549 C184.209,549 186,547.209 186,545 L186,521 C186,518.791 184.209,517 182,517 L182,517 Z'
    : 'M171,525 C171.552,525 172,524.553 172,524 L172,520 C172,519.447 171.552,519 171,519 C170.448,519 170,519.447 170,520 L170,524 C170,524.553 170.448,525 171,525 L171,525 Z M182,543 C182,544.104 181.104,545 180,545 L156,545 C154.896,545 154,544.104 154,543 L154,519 C154,517.896 154.896,517 156,517 L158,517 L158,527 C158,528.104 158.896,529 160,529 L176,529 C177.104,529 178,528.104 178,527 L178,517 L180,517 C181.104,517 182,517.896 182,519 L182,543 L182,543 Z M160,517 L176,517 L176,526 C176,526.553 175.552,527 175,527 L161,527 C160.448,527 160,526.553 160,526 L160,517 L160,517 Z M180,515 L156,515 C153.791,515 152,516.791 152,519 L152,543 C152,545.209 153.791,547 156,547 L180,547 C182.209,547 184,545.209 184,543 L184,519 C184,516.791 182.209,515 180,515 L180,515 Z';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : isDisabled ? 'rgba(16, 16, 16, 0.5)' : stroke;
  const pathClassName = `outline${isDisabled ? ' disabled' : ''}`;

  return (
    <div className="icon" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        height={height}
        viewBox="0 0 32 32"
        {...props}
      >
        <g stroke={strokeColor} strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform={translate} fill="#000000">
            <path className={pathClassName}
              d={pathD}
              fill={outlineColor}
            />
          </g>
        </g>
      </svg>
    </div >
  );
}