export default function CartIcon({
  fill = 'currentColor',
  className = '',
  width = '44',
  height = '44',
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" fill={fill} className={className} width={width}><path d="M280-65q-33 0-56.5-23.5T200-145q0-33 23.5-56.5T280-225q33 0 56.5 23.5T360-145q0 33-23.5 56.5T280-65Zm400 0q-33 0-56.5-23.5T600-145q0-33 23.5-56.5T680-225q33 0 56.5 23.5T760-145q0 33-23.5 56.5T680-65ZM217-815h552q40.617 0 61.808 35.5Q852-744 832-707L713-490q-13 23-34.949 36.5Q656.102-440 630-440H341l-35 65h469v110H280q-56 0-83-47.5t-1-93.5l51-90-136-289H25v-110h154l38 80Z" /></svg>
  );
}
