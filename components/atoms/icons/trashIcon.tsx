function TrashIcon({ fill = "#F7F7F6", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill={fill}
      className={className}
    >
      <path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525zM9.4 17h1.5V8H9.4zm3.7 0h1.5V8h-1.5z"></path>
    </svg>
  );
}

export default TrashIcon;
