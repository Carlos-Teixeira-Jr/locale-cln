// Changes the title based on the url pathname;

export default function modifyString(pathname: string): string {
  const pathMap: { [key: string]: string } = {
    '/adminUserData': 'Dados do Usuário',
    '/adminFavProperties': 'Favoritos',
    '/property/[id]': 'Imóvel',
    '/adminNotifications': 'Notificações',
    '/adminMessages': 'Mensagens',
    '/privacyPolicies': 'Políticas de Privacidade',
    '/register': 'Anunciar - Etapa 1',
    '/registerStep2': 'Anunciar - Etapa 2',
    '/registerStep3': 'Anunciar - Etapa 3',
    '/registerStep35': 'Anunciar',
    '/registerStep4': 'Parabéns!',
    '/announcement': 'Planos de Anúncio',
    '/search': 'Buscar',
    '/admin': 'Anúncios',
  };

  const defaultTitle = 'Home';
  const title = pathMap[pathname] || defaultTitle;

  return capitalizeFirstLetter(title);
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
