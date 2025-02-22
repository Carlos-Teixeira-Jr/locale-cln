export interface UserIconProps {
  fill?: string;
  className?: string;
  width?: string;
  height?: string;
  onClick?: () => void; // Definindo o tipo corretamente
}

export default function UserIcon({
  fill = "currentColor", 
  className="",
  width="44",
  height="44",
  onClick
}: UserIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} height={height} width={width} viewBox="0 96 960 960" className={className} onClick={onClick}>
      <path d="M479.796 562q-77.203 0-126-48.796Q305 464.407 305 387.204 305 310 353.796 261q48.797-49 126-49Q557 212 606.5 261T656 387.204q0 77.203-49.5 126Q557 562 479.796 562ZM135 934V813.205q0-44.507 22.828-77.721Q180.656 702.27 217 685q69-31 133.459-46.5T479.731 623q66.731 0 130.5 16Q674 655 742 685q37.609 15.958 60.805 49.479Q826 768 826 812.945V934H135Z" />
    </svg>
  );
}
