import { useEffect, useState } from "react";

const useTrackLocation = () => {

  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const success = (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocationErrorMessage("");
    setLatitude(latitude);
    setLongitude(longitude);
  }

  const error = () => {
    setLocationErrorMessage("Não foi possível vrificar sua localização");
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationErrorMessage("Seu navegador não suporta a geolocalização")
      setLatitude('');
      setLongitude('');
      setLocation(null);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const pos: any = {
        coords: position.coords,
        timestamp: position.timestamp
      }
      setLocation(pos), (error: any) => console.log(error), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    })
  }, [])

  return {
    location,
    locationErrorMessage,
    latitude,
    longitude,
  }
}

export default useTrackLocation;