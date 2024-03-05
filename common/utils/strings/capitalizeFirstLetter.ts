export function capitalizeFirstLetter(string: string) {
  const stringExists = string;
  if (stringExists) return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowerLetters(string: string) {
  const stringExists = string;
  if (stringExists) return string.toLowerCase();
}