

export default function modifyString(str: string) {
  if (str.length < 2) {
    return 'Home';
  }

  if (str === '/adminUserData') {
    str = '/dados do Usuário'
  }

  const firstCharRemoved = str.substring(1);
  const secondCharCapitalized = firstCharRemoved.charAt(0).toUpperCase();
  const restOfChars = firstCharRemoved.substring(1);

  return secondCharCapitalized + restOfChars;
}