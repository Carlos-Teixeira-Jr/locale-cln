import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
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
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const closeModal = () => {
    localStorage.setItem('seenModal', JSON.stringify(true));
    setModalIsOpen(false);
  };

  useEffect(() => {
    let returningUser = localStorage.getItem('seenModal');
    setModalIsOpen(!returningUser);
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>Locale | {modifyString(pathname)}</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        </Head>
        <ProgressProvider>
          <ToastWrapper autoCloseTime={5000} />
          <Component {...pageProps} />
        </ProgressProvider>
      </SessionProvider>
      {modalIsOpen && (
        <CookiesModal
          isOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}
