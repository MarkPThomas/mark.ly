import { useState } from 'react';
import './icons.css';
import './ArrowVerticalToggleIcon.css'

type Props = React.SVGProps<SVGSVGElement> & {
  cb?: () => void;
  hoverStroke?: string;
  innerColor?: string;
  isDisabled?: boolean;
  isToggled?: boolean;
  outlineColor?: string;
};

export function ArrowVerticalToggleIcon({
  height = "16px",
  width = "16px",
  color = "black",
  stroke = "none",
  strokeWidth = "1",
  innerColor = "#000000",
  outlineColor = "black",
  hoverStroke = "green",
  isDisabled = false,
  isToggled = false,
  cb = null,
  ...props
}: Props) {
  const [hover, setHover] = useState<boolean>(false);
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);

    if (cb) {
      cb();
    }
  };

  const pathD = (hover && !isDisabled)
    ? 'M544.345,1213.39 L534.615,1202.6 C534.167,1202.15 533.57,1201.95 532.984,1201.99 C532.398,1201.95 531.802,1202.15 531.354,1202.6 L521.624,1213.39 C520.797,1214.22 520.797,1215.57 521.624,1216.4 C522.452,1217.23 523.793,1217.23 524.621,1216.4 L532.984,1207.13 L541.349,1216.4 C542.176,1217.23 543.518,1217.23 544.345,1216.4 C545.172,1215.57 545.172,1214.22 544.345,1213.39'
    : 'M542.687,1212.29 L531.745,1200.31 C531.535,1200.1 531.258,1200.01 530.984,1200.03 C530.711,1200.01 530.434,1200.1 530.224,1200.31 L519.281,1212.29 C518.89,1212.69 518.89,1213.32 519.281,1213.72 C519.674,1214.11 520.31,1214.11 520.701,1213.72 L530.984,1202.46 L541.268,1213.72 C541.659,1214.11 542.295,1214.11 542.687,1213.72 C543.079,1213.32 543.079,1212.69 542.687,1212.29';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;
  const viewBox = (hover && !isDisabled) ? '0 -4.5 24 24' : '0 -5 24 24';

  const transformHoverProps = !currentlyToggled ? 'translate(-521, -1202)' : 'scale(1 -1) translate(-521, -1218)';
  const transformProps = !currentlyToggled ? 'translate(-519, -1200)' : 'scale(1 -1) translate(-519, -1216)';
  const transform = (hover && !isDisabled) ? transformHoverProps : transformProps;

  const groupClassName = `icon toggle-button${currentlyToggled ? ' toggled' : ''}`;
  const pathClassName = `outline${isDisabled ? ' disabled' : ''}`;

  return (
    <div className={groupClassName} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        height={height}
        viewBox={viewBox}
        {...props}
      >
        <g stroke={strokeColor} strokeWidth="1" fill="none" fillRule="evenodd" >
          <g transform={transform} fill="#000000">
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