import { IIcon } from '../../../common/interfaces/icons';

export default function ArrowDownIcon({
  fill = 'currentColor',
  width = '14',
  height = '14',
  className = '',
  onClick
}: IIcon) {
  return (
    <svg
      fill={fill}
      width={width}
      height={height}
      className={className}
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick}
    >
      <path
        d="m19-126 461-738 461 738H19Z"
        fill="#5f6368"
      />
    </svg>
  );
}