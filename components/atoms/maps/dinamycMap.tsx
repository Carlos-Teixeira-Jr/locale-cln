import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { FC } from 'react';

interface DynamicMapProps {
  lat: number;
  lng: number;
}

const DynamicMap: FC<DynamicMapProps> = ({ lat, lng }) => {
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  const markerPosition = {
    lat: lat,
    lng: lng,
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