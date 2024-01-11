import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  redo?: boolean;
  outlineColor?: string;
  hoverStroke?: string;
  isDisabled?: boolean;
};

export function UndoRedoIcon({
  height = "24px",
  width = "24px",
  color = "black",
  stroke = "none",
  strokeWidth = "1",
  redo,
  outlineColor = "black",
  hoverStroke = "green",
  isDisabled = false,
  ...props
}: Props) {

  const [hover, setHover] = useState<boolean>(false);

  const pathD = (hover && !isDisabled)
    ? 'M113.983,1202.01 L113.983,1196.11 C114.017,1195.81 113.936,1195.51 113.708,1195.28 C113.312,1194.89 112.67,1194.89 112.274,1195.28 L102.285,1206.24 C102.074,1206.45 101.984,1206.72 101.998,1207 C101.984,1207.27 102.074,1207.55 102.285,1207.76 L112.219,1218.65 C112.59,1218.97 113.271,1219.15 113.708,1218.71 C113.935,1218.49 114.035,1218.29 114,1218 L114,1212 C120.6,1212 126.569,1216.75 127.754,1223.01 C128.552,1221.17 129,1219.15 129,1217.02 C129,1208.73 122.276,1202.01 113.983,1202.01'
    : 'M113,1208 C112.346,1208 109.98,1208.02 109.98,1208.02 L109.98,1213.39 L102.323,1205 L109.98,1196.6 L109.98,1202.01 C109.98,1202.01 112.48,1201.98 113,1202 C120.062,1202.22 124.966,1210.26 124.998,1214.02 C122.84,1211.25 117.17,1208 113,1208 L113,1208 Z M111.983,1200.01 L111.983,1194.11 C112.017,1193.81 111.936,1193.51 111.708,1193.28 C111.312,1192.89 110.67,1192.89 110.274,1193.28 L100.285,1204.24 C100.074,1204.45 99.984,1204.72 99.998,1205 C99.984,1205.27 100.074,1205.55 100.285,1205.76 L110.219,1216.65 C110.403,1216.88 110.67,1217.03 110.981,1217.03 C111.265,1217.03 111.518,1216.91 111.7,1216.72 C111.702,1216.72 111.706,1216.72 111.708,1216.71 C111.936,1216.49 112.017,1216.18 111.983,1215.89 C111.983,1215.89 112,1210.34 112,1210 C118.6,1210 124.569,1214.75 125.754,1221.01 C126.552,1219.17 127,1217.15 127,1215.02 C127,1206.73 120.276,1200.01 111.983,1200.01 L111.983,1200.01 Z';
  const strokeColor = (hover && !isDisabled) ? hoverStroke : stroke;

  const transformHoverProps = redo ? 'scale(-1 1) translate(-130, -1195)' : 'translate(-102, -1195)';
  const transformProps = redo ? 'scale(-1 1) translate(-128, -1193)' : 'translate(-100, -1193)';
  const transform = (hover && !isDisabled) ? transformHoverProps : transformProps;

  const pathClassName = `outline${isDisabled ? ' disabled' : ''}`;

  return (
    <div className="icon" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        height={height}
        viewBox="-0.5 0 28 28"
        {...props}
      >
        <g stroke={strokeColor} strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform={transform} fill="#000000">
            <path className={pathClassName}
              d={pathD}
              fill={outlineColor}
            >
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
}

function setState<T>(arg0: boolean): [any, any] {
  throw new Error('Function not implemented.');
}
