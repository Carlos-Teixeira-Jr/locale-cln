
export const resetObjectToEmptyStrings = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
  }
};