import { useState } from 'react';
import './icons.css';

type Props = React.SVGProps<SVGSVGElement> & {
  innerColor?: string;
  outlineColor?: string;
  hoverStroke?: string;
  isDisabled?: boolean;
};

export function FileIcon({
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

  const translate = (hover && !isDisabled) ? 'translate(-105, -101)' : 'translate(-103, -99)';
  const pathD = (hover && !isDisabled)
    ? 'M125,109 C123.896,109 123,108.104 123,107 L123,103 L129,109 L125,109 L125,109 Z M124,119 L112,119 C111.448,119 111,118.553 111,118 C111,117.448 111.448,117 112,117 L124,117 C124.552,117 125,117.448 125,118 C125,118.553 124.552,119 124,119 L124,119 Z M124,125 L112,125 C111.448,125 111,124.553 111,124 C111,123.447 111.448,123 112,123 L124,123 C124.552,123 125,123.447 125,124 C125,124.553 124.552,125 124,125 L124,125 Z M123,101.028 C122.872,101.028 109,101 109,101 C106.791,101 105,102.791 105,105 L105,129 C105,131.209 106.791,133 109,133 L127,133 C129.209,133 131,131.209 131,129 L131,109 L123,101.028 L123,101.028 Z'
    : 'M122,115 L110,115 C109.448,115 109,115.448 109,116 C109,116.553 109.448,117 110,117 L122,117 C122.552,117 123,116.553 123,116 C123,115.448 122.552,115 122,115 L122,115 Z M122,121 L110,121 C109.448,121 109,121.447 109,122 C109,122.553 109.448,123 110,123 L122,123 C122.552,123 123,122.553 123,122 C123,121.447 122.552,121 122,121 L122,121 Z M123,107 C121.896,107 121,106.104 121,105 L121,101 L127,107 L123,107 L123,107 Z M127,127 C127,128.104 126.104,129 125,129 L107,129 C105.896,129 105,128.104 105,127 L105,103 C105,101.896 105.896,101 107,101 L118.972,101 C118.954,103.395 119,105 119,105 C119,107.209 120.791,109 123,109 L127,109 L127,127 L127,127 Z M121,99 L121,99.028 C120.872,99.028 120.338,98.979 119,99 L107,99 C104.791,99 103,100.791 103,103 L103,127 C103,129.209 104.791,131 107,131 L125,131 C127.209,131 129,129.209 129,127 L129,107 L121,99 L121,99 Z';
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