import { IAddress } from "../interfaces/property/propertyData";

// utils/geocode.ts
const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY as string;

interface GeocodeResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
}

export async function geocodeAddress(address: IAddress): Promise<{ lat: number; lng: number } | null> {

  const geoString = `${address.streetName}, ${address.zipCode}, ${address.city}, Brazil`;
  const encodedGeoString = encodeURIComponent(geoString);

  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedGeoString}&key=${OPENCAGE_API_KEY}`);
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação à API');
    }

    const data: GeocodeResponse = await response.json();
    const result = data.results[0];
    
    if (result) {
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao geocodificar o endereço:', error);
    return null;
  }
}
