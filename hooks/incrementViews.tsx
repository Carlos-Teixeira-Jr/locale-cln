import axios from 'axios';
import { useEffect } from 'react';

const useIncrementView = (cardId: number) => {
  useEffect(() => {
    const viewedCards = JSON.parse(localStorage.getItem('viewedCards') || '[]');

    if (!viewedCards.includes(cardId)) {
      axios.post('/api/increment-view', { cardId })
        .then(() => {
          localStorage.setItem('viewedCards', JSON.stringify([...viewedCards, cardId]));
        })
        .catch(error => {
          console.error('Error incrementing view count', error);
        });
    }
  }, [cardId]);
};

export default useIncrementView;
