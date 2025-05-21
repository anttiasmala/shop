import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { useGetProduct } from '~/utils/apiRequests';

export default function HandleProduct() {
  const [productId, setProductId] = useState('');

  const router = useRouter();

  const { refetch } = useGetProduct(productId);

  useEffect(() => {
    if (!router.isReady) return;
    console.log(router.query.id);
    if (router.query.id && typeof router.query.id === 'string') {
      setProductId(router.query.id);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (productId) refetch();
  }, [productId]);

  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      <div>
        <p>Hello: {productId}</p>
        <button
          onClick={() => {
            try {
              refetch();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Click
        </button>
      </div>
      <Footer />
    </main>
  );
}
