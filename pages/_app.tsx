import Cookies from 'js-cookie';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
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

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      window.dataLayer.push({
        event: 'pageview',
        page: url
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>{modifyString(pathname)}</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <meta name="google-site-verification" content="9Det8YF5WkhISHSSBu7sSjtTFH58r04dttWNQrqcwU8" />
        </Head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9N0HWE8K9Q"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9N0HWE8K9Q');
            `,
          }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var w = window;
                var d = document;
                var s = 'script';
                var l = 'dataLayer';
                var i = 'GTM-NGLK74MM';
                w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0];
                var j=d.createElement(s); j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i;
                f.parentNode.insertBefore(j,f);
              })();
            `
          }}
        />

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
