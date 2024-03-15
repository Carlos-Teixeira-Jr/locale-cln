

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
  if (str === '/adminNotifications') {
    str = '/notificações'
  }
  if (str === '/adminMessages') {
    str = '/mensagens'
  }
  if (str === '/privacyPolicies') {
    str = '/políticas de Privacidade'
  }
  if (str === '/register') {
    str = '/anunciar - Etapa 1'
  }
  if (str === '/registerStep2') {
    str = '/anunciar - Etapa 2'
  }
  if (str === '/registerStep3') {
    str = '/anunciar - Etapa 3'
  }
  if (str === '/registerStep35') {
    str = '/anunciar'
  }
  if (str === '/registerStep4') {
    str = '/parabéns!'
  }
  if (str === '/announcement') {
    str = '/planos de Anúncio'
  }


  const firstCharRemoved = str.substring(1);
  const secondCharCapitalized = firstCharRemoved.charAt(0).toUpperCase();
  const restOfChars = firstCharRemoved.substring(1);

  return secondCharCapitalized + restOfChars;
}