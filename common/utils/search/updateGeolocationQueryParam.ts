import { NextRouter } from "next/router";
import removeQueryParamsUtil from "./removeQueryParams";

const updateGeolocationQueryParam = (geolocation: any, router: NextRouter, latitude: string, longitude: string) => {
  const query = router.query as any;
  if (geolocation) {
    const queryParams = {
      ...query,
      longitude: longitude,
      latitude: latitude
    }
    router.replace({ query: queryParams }, undefined, { scroll: false })
  } else {
    removeQueryParamsUtil(['longitude', 'latitude'], router);
  }
};

export default updateGeolocationQueryParam;
