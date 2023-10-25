import { NextRouter } from "next/router";
import { stringify } from "querystring";

export const removeQueryParam = (param: string, router: NextRouter, query: any) => {
  const { pathname } = router;
  const params = new URLSearchParams(stringify(query));
  params.delete(param);
  params.set('page', '1');
  router.replace({ pathname, query: params.toString() }, undefined, {
    shallow: false,
    scroll: false,
  });
};
