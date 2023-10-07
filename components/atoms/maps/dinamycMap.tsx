import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { FC } from 'react';
import { IGeolocation } from '../../../common/interfaces/property/propertyData';

interface DynamicMapProps {
  geolocation: IGeolocation
}

const DynamicMap: FC<DynamicMapProps> = ({ 
  geolocation 
}) => {
  
  const containerStyle = {
    width: 'full',
    height: '400px',
    display: 'flex'
  };

  const center = {
    lat: geolocation.coordinates[1],
    lng: geolocation.coordinates[0],
  };

  const markerPosition = {
    lat: geolocation.coordinates[1],
    lng: geolocation.coordinates[0],
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default DynamicMap;