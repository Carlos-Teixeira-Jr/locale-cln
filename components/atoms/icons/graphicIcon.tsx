
function GraphicIcon({
  width = "24px",
  height = "24px",
  className = "",
  fill = "currentColor"
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill={fill}
      viewBox="0 -960 960 960"
    >
      <path d="M479.77-52q-71.74 0-137.75-22.33Q276-96.67 221.67-139.67L297-215q41 28.33 88.03 43.33t95.33 15q135.64 0 229.31-93.65 93.66-93.66 93.66-229.67t-93.65-229.68q-93.66-93.66-229.67-93.66t-229.68 93.66Q156.67-616.01 156.67-480H52q0-88.79 33.67-166.4 33.66-77.6 92-135.93 58.33-58.34 136.08-92.34 77.75-34 166-34 88.92 0 166.7 34.07 77.78 34.06 136 92.16 58.22 58.1 92.22 135.85t34 166.75q0 88.75-34.07 166.64-34.06 77.89-92 135.88-57.93 57.99-135.81 91.65Q568.92-52 479.77-52ZM133.33-231l164.25-163.67 125.09 107.34 211-211v113.66h79v-245.66H467v79h113.67L420-391.33 295.33-498.67 93.67-296.33q9.66 20 18.16 34.33 8.5 14.33 21.5 31ZM480-480Z" />
    </svg>
  );
}

export default GraphicIcon;