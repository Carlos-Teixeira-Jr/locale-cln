type CloseIconProps = {
  fill?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
};

export default function CloseIcon({ 
  fill = 'currentColor', 
  width = "48", 
  height = "48", 
  viewBox="0 0 48 48", 
  className="bi bi-geo-alt",
  onClick
}: CloseIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill={fill} 
      height={height} 
      width={width}
      className={className}
      viewBox={viewBox}
      onClick={onClick}
    >
      <path d="m12.45 38.85-3.3-3.3L20.7 24 9.15 12.45l3.3-3.3L24 20.7 35.55 9.15l3.3 3.3L27.3 24l11.55 11.55-3.3 3.3L24 27.3Z"/>
    </svg>
  );
}