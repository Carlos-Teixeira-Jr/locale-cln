import { NextRouter } from "next/router";
import { stringify } from "querystring";

export const removeQueryParamUtil = (param: string, router: NextRouter, query: any) => {
  const { pathname } = router;
  const params = new URLSearchParams(stringify(query));
  params.delete(param);
  params.set('page', '1');
  return router.replace({ pathname, query: params.toString() }, undefined, {
    shallow: false,
    scroll: false,
  });
};
