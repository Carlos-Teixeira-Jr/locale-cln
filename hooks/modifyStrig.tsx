

export default function modifyString(str: string) {
  if (str.length < 2) {
    return 'Home';
  }

  if (str === '/adminUserData') {
    str = '/dados do Usuário'
  }
  if (str === '/adminFavProperties') {
    str = '/favoritos'
  }
  if (str === '/property/[id]') {
    str = '/Imóvel'
  }

  const firstCharRemoved = str.substring(1);
  const secondCharCapitalized = firstCharRemoved.charAt(0).toUpperCase();
  const restOfChars = firstCharRemoved.substring(1);

  return secondCharCapitalized + restOfChars;
}