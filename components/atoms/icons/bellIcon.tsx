export default function BellIcon({
  fill = "currentColor", 
  className="",
  width="44",
  height="44"
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} height={height} width={width} viewBox="0 96 960 960" className={className}>
      <path d="M165.44 878q-21.44 0-34.94-13.5-13.5-13.5-13.5-34t13.5-34Q144 783 165 783h45V505q0-92.085 53.5-167.542Q317 262 407 241.583V218q0-30.917 21.25-50.958Q449.5 147 480 147t51.75 20.042Q553 187.083 553 218v23.583Q644 262 698 337.458 752 412.915 752 505v278h44q19.875 0 33.938 13.5Q844 810 844 830.5t-14.062 34Q815.875 878 796 878H165.44Zm315.06 123q-35.5 0-62-25.619Q392 949.763 392 913h177q0 37-26 62.5t-62.5 25.5Z" />
    </svg>
  );
}
