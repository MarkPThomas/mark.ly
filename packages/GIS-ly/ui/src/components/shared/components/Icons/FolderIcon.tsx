type DocumentIconProps = React.SVGProps<SVGSVGElement> & {
  innerColor?: string;
  outlineColor?: string
};

export function FolderIcon({
  height = "24px",
  width = "24px",
  color = "black",
  stroke = "none",
  strokeWidth = "1",
  innerColor = "#000000",
  outlineColor,
  ...props
}: DocumentIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      {...props}
    >
      <g stroke={stroke} strokeWidth={strokeWidth} fill={color} fillRule="nonzero">
        <g transform="translate(-360, -151)" fill={innerColor}>
          <path className="outline"
            d="M390,161 L362,161 L362,155 C362,153.896 362.896,153 364,153 L370,153 C371.104,153 372,153.896 372,155 L372,157 L388,157 C389.104,157 390,157.896 390,159 L390,161 L390,161 Z M390,179 C390,180.104 389.104,181 388,181 L364,181 C362.896,181 362,180.104 362,179 L362,163 L390,163 L390,179 L390,179 Z M388,155 L374,155 C374,152.791 372.209,151 370,151 L364,151 C361.791,151 360,152.791 360,155 L360,179 C360,181.209 361.791,183 364,183 L388,183 C390.209,183 392,181.209 392,179 L392,159 C392,156.791 390.209,155 388,155 L388,155 Z"
            fill={outlineColor || color}
          >
          </path>
        </g>
      </g>
    </svg>
  );
}