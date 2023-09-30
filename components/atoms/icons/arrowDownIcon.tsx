import { IIcon } from "../../../common/interfaces/icons";

export default function ArrowDownIcon({fill = "currentColor", width="17", height="23", className=""}: IIcon) {
  return (
    <svg fill={fill} width={width} height={height} className={className} viewBox="0 0 17 23"  xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 22.894L0.272758 0.473478L16.7272 0.473478L8.5 22.894Z" fill="#6B7280"/>
    </svg>
  );
}