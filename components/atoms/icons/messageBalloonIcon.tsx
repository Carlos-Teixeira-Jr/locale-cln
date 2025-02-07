export default function MessageBalloonIcon({fill = "currentColor", width="44", className="", viewBox="0 96 960 960"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} height="44" width={width} viewBox={viewBox} className={className}>
      <path d="M400 407h321v-60H400v60Zm0 120h321v-60H400v60Zm0 120h200v-60H400v60ZM281 417q17 0 28.5-11.5T321 377q0-17-11.5-28.5T281 337q-17 0-28.5 11.5T241 377q0 17 11.5 28.5T281 417Zm0 120q17 0 28.5-11.5T321 497q0-17-11.5-28.5T281 457q-17 0-28.5 11.5T241 497q0 17 11.5 28.5T281 537Zm0 120q17 0 28.5-11.5T321 617q0-17-11.5-28.5T281 577q-17 0-28.5 11.5T241 617q0 17 11.5 28.5T281 657ZM80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Z" />
    </svg>
  );
}
