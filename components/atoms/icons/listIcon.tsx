interface IListOn {
  list: boolean;
}
function ListIcon({ list }: IListOn) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="25"
      fill="none"
      viewBox="0 0 33 25"
      className={`ml-[6px] ${list && 'selected:fill-[#F5BF5D]'}`}
    >
      <rect
        width="7"
        height="6"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
      <rect
        width="7"
        height="6"
        y="10"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
      <rect
        width="7"
        height="6"
        y="19"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
      <rect
        width="23"
        height="6"
        x="10"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
      <rect
        width="23"
        height="6"
        x="10"
        y="10"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
      <rect
        width="23"
        height="6"
        x="10"
        y="19"
        fill="#6B7280"
        rx="2"
        className={`${list && 'fill-[#F5BF5D]'}`}
      ></rect>
    </svg>
  );
}

export default ListIcon;
