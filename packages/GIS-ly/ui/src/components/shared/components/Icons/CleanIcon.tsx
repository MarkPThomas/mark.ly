import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  innerColor?: string;
  outlineColor?: string;
  hoverStroke?: string;
  isDisabled?: boolean;
};

export function CleanIcon({
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

  const translate = (hover && !isDisabled) ? 'translate(-101, -156)' : 'translate(-99, -154)';
  const pathD = (hover && !isDisabled)
    ? 'M132.132,156.827 C130.975,155.685 129.099,155.685 127.942,156.827 L115.336,169.277 L119.499,173.44 L132.132,160.964 C133.289,159.821 133.289,157.969 132.132,156.827 L132.132,156.827 Z M112.461,180.385 C111.477,181.298 107.08,183.333 104.491,181.36 C104.491,181.36 105.392,180.657 106.074,179.246 C107.703,174.919 111.763,175.56 111.763,175.56 L113.159,176.938 C113.173,176.952 114.202,178.771 112.461,180.385 L112.461,180.385 Z M113.913,170.683 L110.764,173.788 C108.661,173.74 105.748,174.485 104.491,178.603 C103.53,180.781 101,180.671 101,180.671 C106.253,186.498 112.444,183.196 113.857,181.764 C115.1,180.506 115.279,178.966 115.146,177.734 L118.076,174.846 L113.913,170.683 L113.913,170.683 Z'
    : 'M128.735,157.585 L116.047,170.112 L114.65,168.733 L127.339,156.206 C127.725,155.825 128.35,155.825 128.735,156.206 C129.121,156.587 129.121,157.204 128.735,157.585 L128.735,157.585 Z M112.556,173.56 C112.427,173.433 111.159,172.181 111.159,172.181 L113.254,170.112 L114.65,171.491 L112.556,173.56 L112.556,173.56 Z M110.461,178.385 C109.477,179.298 105.08,181.333 102.491,179.36 C102.491,179.36 103.392,178.657 104.074,177.246 C105.703,172.919 109.763,173.56 109.763,173.56 L111.159,174.938 C111.173,174.952 112.202,176.771 110.461,178.385 L110.461,178.385 Z M130.132,154.827 C128.975,153.685 127.099,153.685 125.942,154.827 L108.764,171.788 C106.661,171.74 103.748,172.485 102.491,176.603 C101.53,178.781 99,178.671 99,178.671 C104.253,184.498 110.444,181.196 111.857,179.764 C113.1,178.506 113.279,176.966 113.146,175.734 L130.132,158.964 C131.289,157.821 131.289,155.969 130.132,154.827 L130.132,154.827 Z';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;
  const pathClassName = `outline${isDisabled ? ' disabled' : ''}`;

  return (
    <div className="icon" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        height={height}
        viewBox="0 -2 32 32"
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