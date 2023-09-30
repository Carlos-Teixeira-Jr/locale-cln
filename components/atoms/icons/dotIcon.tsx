import { IIcon } from "../../../common/interfaces/icons";

export default function DotIcon({fill="currentColor", width="28", height="28", viewBox="0 0 16 16"}: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      className="bi bi-dot"
      viewBox={viewBox}
    >
      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
    </svg>
  );
}
