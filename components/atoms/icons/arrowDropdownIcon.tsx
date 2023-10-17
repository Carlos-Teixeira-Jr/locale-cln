interface IDropdown {
  open: boolean;
}

function ArrowDropdownIcon({ open }: IDropdown) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="#6B7280"
      className={`mr-[-10px] ${
        open
          ? 'transform rotate-180 transition-transform duration-300 ease-in-out'
          : 'transition-transform duration-300 ease-in-out'
      }`}
    >
      <path d="M20 25l-8.333-8.292h16.666z"></path>
    </svg>
  );
}

export default ArrowDropdownIcon;
