import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { IGeolocation } from '../../../common/interfaces/property/propertyData';

interface StaticMapProps {
  width: number;
  height: number;
  geolocation: IGeolocation;
  mapIsActive: boolean;
  onMapChange: (isActive: boolean) => void;
}

const StaticMap: FC<StaticMapProps> = ({
  width,
  height,
  geolocation,
  mapIsActive,
  onMapChange,
}) => {
  const mapFallbackUrl = '/images/static-fallback-map.png';
  const [error, setError] = useState(false);
  const [isActive, setIsActive] = useState(mapIsActive);
  const long = geolocation.coordinates[0];
  const lat = geolocation.coordinates[1];
  const googleStaticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=15&size=${width}x${height}&markers=${lat},${long}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  useEffect(() => {
    onMapChange(isActive);
  }, [isActive]);

  return (
    <div className="relative">
      {!isActive && (
        <div
          id="backdrop"
          className={`bg-black absolute w-full h-full lg:w-full opacity-50 lg:h-[${height}]`}
        ></div>
      )}

      <Image
        src={!error ? googleStaticMapUrl : mapFallbackUrl}
        alt={''}
        width={width}
        height={height}
        id="map-image"
        className="flex justify-center"
        onError={() => setError(true)}
      />
      {!isActive && (
        <button
          className={
            !isActive
              ? 'bg-primary w-56 h-14 absolute top-1/2 left-1/2 rounded-[10px] text-tertiary md:text-lg font-extrabold transform -translate-x-1/2 -translate-y-1/2 hover:bg-red-600'
              : 'hidden'
          }
          onClick={() => setIsActive(true)}
        >
          Explorar no mapa
        </button>
      )}
    </div>
  );
};

export default StaticMap;
