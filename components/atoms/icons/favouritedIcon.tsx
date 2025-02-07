function FavouritedIcon({
  width="48",
  height="48",
  className=""
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill="#F7F7F6"
      viewBox="0 96 960 960"
    >
      <path d="M480 935l-41-37q-106-97-175-167.5t-110-126Q113 549 96.5 504T80 413q0-90 60.5-150.5T290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.5T880 413q0 46-16.5 91T806 604.5q-41 55.5-110 126T521 898l-41 37z"></path>
    </svg>
  );
}

export default FavouritedIcon;
