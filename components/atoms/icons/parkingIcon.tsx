import { IIcon } from '../../../common/interfaces/icons';

export default function ParkingIcon({
  fill = 'currentColor',
  height = '38',
  width = '38',
  className = '',
}: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      fill={fill}
      height={height}
      width={width}
    >
      <path d="M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160zm0-80h640v-640H160v640zm200-240q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400zM200-516v264q0 14 9 23t23 9h16q14 0 23-9t9-23v-48h400v48q0 14 9 23t23 9h16q14 0 23-9t9-23v-264l-66-192q-5-14-16.5-23t-25.5-9H308q-14 0-25.5 9T266-708l-66 192zm106-64l28-80h292l28 80H306zM160-800v640-640zm120 420v-120h400v120H280z"></path>
    </svg>
  );
}
