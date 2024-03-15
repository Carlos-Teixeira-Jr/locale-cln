import { NextRouter } from "next/router";
import removeQueryParamsUtil from "./removeQueryParams";

const updateGeolocationQueryParam = async (geolocation: any, router: NextRouter, latitude: string, longitude: string) => {
  const query = router.query as any;
  if (geolocation) {
    const queryParams = {
      ...query,
      longitude: longitude,
      latitude: latitude
    }
    router.push({ query: queryParams }, undefined, { scroll: false })
  } else {
    removeQueryParamsUtil(['longitude', 'latitude'], router);
  }
};

export default updateGeolocationQueryParam;
