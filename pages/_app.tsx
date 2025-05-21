import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
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
