interface MenuIconProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
}

export default function MenuIcon({ children, width = "24", height = "24" }: MenuIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className="bi bi-list text-primary cursor-pointer mr-2 my-auto"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
      ></path>
      {children}
    </svg>
  );
}
