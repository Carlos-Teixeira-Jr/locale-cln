import { useEffect } from "react";

// Handles the query url params checking to verify the tags thats already selected on rendering;

export const useTagEffect = (query: any, selectedTags: string[], setSelectedTags: any) => {
  useEffect(() => {
    handleTagEffect(query.tags, selectedTags, setSelectedTags);
  }, [query.tags]);
};

const handleTagEffect = (queryTags: string, selectedTags: string[], setSelectedTags: any) => {
  const tagToCheck = getTagToCheck(queryTags);

  if (tagToCheck && !selectedTags.includes(tagToCheck)) {
    setSelectedTags([tagToCheck]);
  }
};

const getTagToCheck = (queryTags: string): string | null => {
  switch (queryTags) {
    case 'aceita pets':
      return 'aceita pets';
    case 'mobiliado':
      return 'mobiliado';
    default:
      return null;
  }
};
