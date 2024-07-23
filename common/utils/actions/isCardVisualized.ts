// Função para verificar se o card foi clicado
export const isCardVisualized = (cardId: string): boolean => {
  if (typeof window !== 'undefined') {
    const visualizedCards = JSON.parse(localStorage.getItem('visualizedCards') || '[]');
    return visualizedCards.includes(cardId);
  }
  return false;
};