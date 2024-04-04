import { useEffect } from 'react';

export function useOutsideClick(ref: React.RefObject<HTMLElement>, dropdown: React.Dispatch<React.SetStateAction<boolean>>, isOpen: boolean): void {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        dropdown(false);
      } else {
        dropdown(true);
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, dropdown]);
}
