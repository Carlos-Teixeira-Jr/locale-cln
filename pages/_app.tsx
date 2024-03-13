import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { verifyCookiesPolicy } from '../common/utils/verifyCookiesPolicy';
import CookiesModal from '../components/atoms/modals/cookiesModal';
import ToastWrapper from '../components/atoms/toast/toastWrapper';
import { ProgressProvider } from '../context/registerProgress';
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
    localStorage.setItem('locale.cookiesPolicy', 'true');
    setShowCookieModal(false);
  };

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          {/* <title>Locale | {modifyString(pathname)}</title> */}
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
