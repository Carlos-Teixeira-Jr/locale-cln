import Cookies from 'js-cookie';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { checkAndClearLocalStorage } from '../common/utils/clearStoredData';
import { verifyCookiesPolicy } from '../common/utils/verifyCookiesPolicy';
import CookiesModal from '../components/atoms/modals/cookiesModal';
import ToastWrapper from '../components/atoms/toast/toastWrapper';
import { ProgressProvider } from '../context/registerProgress';
import modifyString from '../hooks/modifyStrig';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;
  const [showCookieModal, setShowCookieModal] = useState(false);
  verifyCookiesPolicy(setShowCookieModal);

  const closeModal = () => {
    Cookies.set('locale.cookiesPolicy', 'true');
    setShowCookieModal(false);
  };

  // Limpa os dados armazenados no navegador ao sair das telas de cadastro de anúncio;
  useEffect(() => {
    checkAndClearLocalStorage(pathname);
  }, [pathname]);

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>{modifyString(pathname)}</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        </Head>
        <ProgressProvider>
          <ToastWrapper autoCloseTime={5000} />
          <Component {...pageProps} />
        </ProgressProvider>
      </SessionProvider>

      {showCookieModal && (
        <CookiesModal
          isOpen={showCookieModal}
          setModalIsOpen={setShowCookieModal}
          onClose={closeModal}
        />
      )}
    </>
  );
}
