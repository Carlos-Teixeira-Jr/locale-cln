export default function HeartIcon({
  fill = 'currentColor',
  className = '',
  width = '44',
  height = '44',
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      height={height}
      width={width}
      viewBox="0 96 960 960"
      className={className}
    >
      <path d="m480 935-41-37q-106-97-175-167.5t-110-126Q113 549 96.5 504T80 413q0-90 60.5-150.5T290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.5T880 413q0 46-16.5 91T806 604.5q-41 55.5-110 126T521 898l-41 37Z" />
    </svg>
  );
}
