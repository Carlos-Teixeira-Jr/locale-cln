import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import modifyString from '../hooks/modifyStrig';
import { ProgressProvider } from '../context/registerProgress';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          {/* <title>Locale | {modifyString(pathname)}</title> */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        </Head>
        <ProgressProvider>
          <Component {...pageProps} />
        </ProgressProvider>
        <ToastContainer />
      </SessionProvider>
    </>
  );
}
