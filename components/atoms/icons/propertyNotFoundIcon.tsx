import { IIcon } from "../../../common/interfaces/icons";

export default function PropertyNotFoundIcon({fill = "currentColor", width="164px", height="164px", className="", viewBox="0 0 164 164"}: IIcon) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} version="1.1" viewBox={viewBox}>
      <title>Empty state / No matches</title>
      <desc>Created with Sketch.</desc>
      <g id="Empty-state-/-No-matches" fill-rule="evenodd" fill="none">
        <g id="Group">
          <circle id="Oval" fillOpacity=".08" cy="82" cx="82" r="82" fill="#008295"/>
          <path id="Path-2-Copy-5" d="m82 41l-40 30.988v48.342c0 1.66 1.343 3 3 3h23.711v-17.33c5.05-3.71 9.479-5.56 13.289-5.56s8.261 1.85 13.354 5.56v17.33h23.646c1.66 0 3-1.34 3-3v-48.342l-40-30.988z" fillRule="nonzero" stroke="#6F6F6F" strokeDasharray="8,4" strokeWidth="2" fill="#fff"/>
        </g>
      </g>
    </svg>
  );
}