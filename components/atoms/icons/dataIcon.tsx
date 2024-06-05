export default function DataIcon({ fill = "currentColor", width = "40", height = "40", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 10H10v20h20V10zM16.667 21.667h-3.334v5h3.334v-5zm1.666-8.334h3.334v13.334h-3.334V13.333zm8.334 5h-3.334v8.334h3.334v-8.334z" fill={fill} fillRule="evenodd" className={className} /></svg>
  );
}