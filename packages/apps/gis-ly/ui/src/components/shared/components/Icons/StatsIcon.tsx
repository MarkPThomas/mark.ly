import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  hoverStroke?: string;
  outlineColor?: string;
  isDisabled?: boolean;
};

export function StatsIcon({
  height = "24px",
  width = "24px",
  color = "black",
  stroke = "none",
  strokeWidth = "1",
  outlineColor = "black",
  hoverStroke = "green",
  isDisabled = false,
  ...props
}: Props) {

  const [hover, setHover] = useState<boolean>(false);

  const translate = (hover && !isDisabled) ? 'translate(-314, -673)' : 'translate(-312, -671)';
  const pathD = (hover && !isDisabled)
    ? 'M328,673 L326,673 C324.896,673 324,673.896 324,675 L324,703 C324,704.104 324.896,705 326,705 L328,705 C329.104,705 330,704.104 330,703 L330,675 C330,673.896 329.104,673 328,673 L328,673 Z M338,689 L336,689 C334.896,689 334,689.896 334,691 L334,703 C334,704.104 334.896,705 336,705 L338,705 C339.104,705 340,704.104 340,703 L340,691 C340,689.896 339.104,689 338,689 L338,689 Z M318,682 L316,682 C314.896,682 314,682.896 314,684 L314,703 C314,704.104 314.896,705 316,705 L318,705 C319.104,705 320,704.104 320,703 L320,684 C320,682.896 319.104,682 318,682 L318,682 Z'
    : 'M336,700 C336,700.553 335.553,701 335,701 C334.447,701 334,700.553 334,700 L334,690 C334,689.448 334.447,689 335,689 C335.553,689 336,689.448 336,690 L336,700 L336,700 Z M336,687 L334,687 C332.896,687 332,687.896 332,689 L332,701 C332,702.104 332.896,703 334,703 L336,703 C337.104,703 338,702.104 338,701 L338,689 C338,687.896 337.104,687 336,687 L336,687 Z M316,700 C316,700.553 315.553,701 315,701 C314.447,701 314,700.553 314,700 L314,683 C314,682.448 314.447,682 315,682 C315.553,682 316,682.448 316,683 L316,700 L316,700 Z M316,680 L314,680 C312.896,680 312,680.896 312,682 L312,701 C312,702.104 312.896,703 314,703 L316,703 C317.104,703 318,702.104 318,701 L318,682 C318,680.896 317.104,680 316,680 L316,680 Z M326,700 C326,700.553 325.553,701 325,701 C324.447,701 324,700.553 324,700 L324,674 C324,673.447 324.447,673 325,673 C325.553,673 326,673.447 326,674 L326,700 L326,700 Z M326,671 L324,671 C322.896,671 322,671.896 322,673 L322,701 C322,702.104 322.896,703 324,703 L326,703 C327.104,703 328,702.104 328,701 L328,673 C328,671.896 327.104,671 326,671 L326,671 Z';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;
  const pathClassName = `outline${isDisabled ? ' disabled' : ''}`;

  return (
    <div className="icon" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        height={height}
        viewBox="-3 0 32 32"
        {...props}
      >
        <g stroke={strokeColor} strokeWidth="1" fill="none" fillRule="evenodd" >
          <g transform={translate} fill="#000000">
            <path className={pathClassName}
              d={pathD}
              fill={outlineColor}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}