import { NextRouter } from "next/router";
import { removeQueryParamUtil } from "../removeQueryParams";

const updateLocationQueryParam = (location: string | any[], query: any, router: NextRouter) => {
  if (location.length > 0) {
    const queryParams = {
      ...query,
      location: JSON.stringify(location),
    };
    return router.push({ query: queryParams }, undefined, { scroll: false });
  } else {
    return removeQueryParamUtil('location', router, query);
  }
};

export default updateLocationQueryParam;