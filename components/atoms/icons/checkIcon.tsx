import { IIcon } from "../../../common/interfaces/icons";

export default function CheckIcon({fill = "currentColor", width="48", height="48", className="", viewBox="0 96 960 960"}: IIcon) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} height={height} viewBox={viewBox} width={width} className={className}>
      <path d="M378 834 130 586l68-68 180 180 383-383 68 68-451 451Z"/>
    </svg>
  );
}