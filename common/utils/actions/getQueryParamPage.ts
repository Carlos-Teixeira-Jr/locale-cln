// hooks/usePageQueryParam.ts
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const usePageQueryParam = (initialPage: number, setCurrentPage: (page: number) => void) => {
  const router = useRouter();

  useEffect(() => {
    const parsedPage = parseInt(router.query.page as string, 10);
    if (!isNaN(parsedPage)) {
      setCurrentPage(parsedPage);
    } else {
      setCurrentPage(initialPage);
    }
  }, [router.query.page, initialPage, setCurrentPage]); // Reexecuta o efeito quando a query.page muda
};

export default usePageQueryParam;

