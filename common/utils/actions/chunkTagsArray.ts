import { ITagsData } from "../../interfaces/tagsData";

export const chunkArray = (array: ITagsData[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};