interface IGridOn {
  grid: boolean;
}
function GridIcon({ grid }: IGridOn) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="25"
      fill="none"
      viewBox="0 0 33 25"
      className={`ml-[6px] ${grid && 'fill-[#F5BF5D]'} `}
    >
      <rect
        width="15"
        height="10"
        y="15"
        fill="#6B7280"
        rx="2"
        className={`${grid && 'fill-[#F5BF5D]'} `}
      ></rect>
      <rect
        width="15"
        height="11"
        fill="#6B7280"
        rx="2"
        className={`${grid && 'fill-[#F5BF5D]'} `}
      ></rect>
      <rect
        width="15"
        height="11"
        x="18"
        fill="#6B7280"
        rx="2"
        className={`${grid && 'fill-[#F5BF5D]'} `}
      ></rect>
      <rect
        width="15"
        height="10"
        x="18"
        y="15"
        fill="#6B7280"
        rx="2"
        className={`${grid && 'fill-[#F5BF5D]'} `}
      ></rect>
    </svg>
  );
}

export default GridIcon;
