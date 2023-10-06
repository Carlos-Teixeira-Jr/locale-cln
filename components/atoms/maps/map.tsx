import Image from 'next/image';
import { FC, useState } from 'react';

interface StaticMapProps {
  lat: number | string;
  lng: number | string;
  width: number;
  height: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StaticMap: FC<StaticMapProps> = ({ lat, lng, width, height, onClick }) => {

  const [backdropActive, setBackdropActive] = useState(true);
  const mapFallbackUrl = "/images/static-fallback-map.png";
  const [error, setError] = useState(false);
  const googleStaticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${width}x${height}&markers=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  console.log("🚀 ~ file: map.tsx:19 ~ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  return (
    <div className='relative'>
      <div id='backdrop' className={`bg-black absolute w-full h-full lg:w-full opacity-50 lg:h-[${height}]`}></div>
      <Image 
        src={!error ? googleStaticMapUrl : mapFallbackUrl} 
        alt={''}
        width={width}
        height={height}
        id='map-image'
        className='flex justify-center'
        onError={() => setError(true)}
      />
      <button className={backdropActive ? 'bg-primary w-[100px] md:w-[384px] md:h-[87px] absolute top-1/2 left-1/2 rounded-[10px] text-tertiary md:text-2xl font-extrabold transform -translate-x-1/2 -translate-y-1/2' : 'hidden'} onClick={onClick}>Explorar no mapa</button>
    </div>
  );
};

export default StaticMap;