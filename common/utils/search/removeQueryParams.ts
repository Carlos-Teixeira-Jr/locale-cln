import { NextRouter } from "next/router";
import { stringify } from "querystring";

const removeQueryParamsUtil = (paramsToRemove: string[], router: NextRouter) => {
  const { pathname, query } = router;
  const params = new URLSearchParams(stringify(query));

  paramsToRemove.forEach(param => params.delete(param));

  params.set('page', '1');

  router.replace({ pathname, query: params.toString() }, undefined, {
    shallow: false,
    scroll: false,
  });
};

export default removeQueryParamsUtil;
