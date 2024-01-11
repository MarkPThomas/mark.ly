import { useState } from 'react';
import './icons.css';

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

  // const pathD = (hover && !isDisabled)
  //   ? 'M178.536,1109.54 C178.145,1109.93 177.512,1109.93 177.121,1109.54 L170,1102.41 L162.879,1109.54 C162.488,1109.93 161.855,1109.93 161.464,1109.54 C161.074,1109.15 161.074,1108.51 161.464,1108.12 L169.121,1100.46 C169.361,1100.22 169.689,1100.15 170,1100.21 C170.311,1100.15 170.639,1100.22 170.879,1100.46 L178.536,1108.12 C178.926,1108.51 178.926,1109.15 178.536,1109.54 L178.536,1109.54 Z M170,1089 C161.164,1089 154,1096.16 154,1105 C154,1113.84 161.164,1121 170,1121 C178.836,1121 186,1113.84 186,1105 C186,1096.16 178.836,1089 170,1089 L170,1089 Z'
  //   : 'M168,1117 C160.268,1117 154,1110.73 154,1103 C154,1095.27 160.268,1089 168,1089 C175.732,1089 182,1095.27 182,1103 C182,1110.73 175.732,1117 168,1117 L168,1117 Z M168,1087 C159.164,1087 152,1094.16 152,1103 C152,1111.84 159.164,1119 168,1119 C176.836,1119 184,1111.84 184,1103 C184,1094.16 176.836,1087 168,1087 L168,1087 Z M168.879,1098.46 C168.639,1098.22 168.311,1098.15 168,1098.21 C167.689,1098.15 167.361,1098.22 167.121,1098.46 L159.464,1106.12 C159.074,1106.51 159.074,1107.15 159.464,1107.54 C159.855,1107.93 160.488,1107.93 160.879,1107.54 L168,1100.41 L175.121,1107.54 C175.512,1107.93 176.145,1107.93 176.536,1107.54 C176.926,1107.15 176.926,1106.51 176.536,1106.12 L168.879,1098.46 L168.879,1098.46 Z';
  // const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;

  // const transformHoverProps = !currentlyToggled ? 'scale(1 -1) translate(-154, -1121)' : 'translate(-154, -1089)';
  // const transformProps = !currentlyToggled ? 'scale(1 -1) translate(-152, -1119)' : 'translate(-152, -1087)';
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

  // return (
  //   <div className="icon toggle-button" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} onClick={handleClick}>
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       version="1.1"
  //       width={width}
  //       height={height}
  //       viewBox="0 0 32 32"
  //       {...props}
  //     >
  //       <g stroke={strokeColor} strokeWidth="1" fill="none" fillRule="evenodd" >
  //         <g transform={transform} fill="#000000">
  //           <path className={pathClassName}
  //             d={pathD}
  //             fill={outlineColor}
  //           />
  //         </g>
  //       </g>
  //     </svg>
  //   </div>
  // );
}