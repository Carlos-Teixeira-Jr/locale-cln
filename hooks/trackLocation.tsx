import { useEffect, useMemo, useState } from "react"

const useTrackLocation = () => {

  const [ locationErrorMessage, setLocationErrorMessage ] = useState("");
  const [ location, setLocation ] = useState(null);
  const [ latitude, setLatitude ] = useState("");
  const [ longitude, setLongitude ] = useState("");

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
    if(!navigator.geolocation){
      setLocationErrorMessage("Seu navegador não suporta a geolocalização")
    }else{
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
  },[])

  // const cachedLocation = useMemo(() => {
  //   const cachedCoords = localStorage.getItem('location');
  //   if (cachedCoords) {
  //     return JSON.parse(cachedCoords);
  //   }
  //   return null;
  // }, []);

  return {
    location,
    locationErrorMessage,
    latitude,
    longitude,
    //cachedLocation,
  }
}

export default useTrackLocation;