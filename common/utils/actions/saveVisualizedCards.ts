// Função para salvar o ID do card clicado
export const saveVisualizedCards = (id: string) => {
  if (typeof window !== 'undefined') {
    const visualizedCards = JSON.parse(localStorage.getItem('visualizedCards') || '[]');
    if (!visualizedCards.includes(id)) {
      visualizedCards.push(id);
      localStorage.setItem('visualizedCards', JSON.stringify(visualizedCards));
    }
  }
};