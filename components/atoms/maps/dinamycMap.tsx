import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { FC } from 'react';
import { IGeolocation } from '../../../common/interfaces/property/propertyData';

interface DynamicMapProps {
  geolocation: IGeolocation
}

const DynamicMap: FC<DynamicMapProps> = ({
  geolocation
}) => {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const center = {
    lat: geolocation.coordinates[1],
    lng: geolocation.coordinates[0],
  };

  const markerPosition = {
    lat: geolocation.coordinates[1],
    lng: geolocation.coordinates[0],
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey ?? ""}>
        <GoogleMap mapContainerClassName='w-full h-[200px] md:h-96' center={center} zoom={15}>
          <MarkerF position={markerPosition} />
        </GoogleMap>
      </LoadScript>
    </div>

  );
};

export default DynamicMap;