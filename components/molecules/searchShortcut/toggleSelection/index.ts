export const toggleSelection = (query: any, router: any, item: string) => {
  const tags: string[] = Array.isArray(query.tags)
    ? query.tags
    : query.tags
      ? query.tags.split(',')
      : [];

  const updatedTags = updateTags(tags, item);
  updateQuery(query, router, updatedTags);
};

const updateTags = (tags: string[], item: string): string[] => {
  if (tags.includes(item)) {
    return tags.filter((tag) => tag !== item);
  } else {
    return [...tags, item];
  }
};

const updateQuery = (query: any, router: any, updatedTags: string[]) => {
  const updatedQueryTags = updatedTags.join(',');

  const updatedQuery = updatedTags.length > 0 ? { ...query, tags: updatedQueryTags } : removeTagsFromQuery(query);

  updatedQuery.page = '1';
  router.push({
    pathname: router.pathname,
    query: updatedQuery,
  });
};

const removeTagsFromQuery = (query: any): any => {
  const { tags, ...updatedQuery } = query;
  return updatedQuery;
};
