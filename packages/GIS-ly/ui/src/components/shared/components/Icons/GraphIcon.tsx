import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  hoverStroke?: string;
  outlineColor?: string;
  isDisabled?: boolean;
};

export function GraphIcon({
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

  const translate = (hover && !isDisabled) ? 'translate(-518, -153)' : 'translate(-516, -151)';
  const pathD = (hover && !isDisabled)
    ? 'M533,153 L533,170.3 L548.947,175.084 C549.568,173.543 550,171.688 550,169.571 C550,160.419 541.453,153 533,153 L533,153 Z M531,156 C524.029,156.728 518,163.026 518,170.5 C518,178.508 524.492,185 532.5,185 C538.397,185 543.463,181.474 545.729,176.418 L531,172 L531,156 L531,156 Z'
    : 'M544.551,172.613 L531,168 L531,153 C538.779,152.961 545.889,159.682 545.889,167.571 C545.889,169.629 545.351,171.19 544.551,172.613 L544.551,172.613 Z M530.5,181 C523.597,181 518,175.404 518,168.5 C518,162.21 522.917,156.878 529,156 L529,169.429 L541.709,173.855 C540.018,178.128 535.163,181 530.5,181 L530.5,181 Z M531,151 L529,151 L529,154 C521.721,154.789 516,161.026 516,168.5 C516,176.508 522.492,183 530.5,183 C536.406,183 541.479,179.463 543.738,174.397 L546,175 C547.093,173.205 548,170.657 548,167.571 C548,158.419 540.005,151 531,151 L531,151 Z';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;
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