import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const cartUUID = window.localStorage.getItem('cartUUID');
    const cartSettings = window.localStorage.getItem('cartSettings');
    if (!cartUUID) {
      const randomUUID = crypto.randomUUID();
      window.localStorage.setItem('cartUUID', randomUUID);

      void axios.post(`/api/cart`, { cartUUID: randomUUID });
    }
    if (!cartSettings) {
      window.localStorage.setItem(
        'cartSettings',
        JSON.stringify({ isLoggedIn: false, isCartLinked: false }),
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, interactive-widget=resizes-visual"
          />
        </Head>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
          limit={1}
        />
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
