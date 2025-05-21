import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HandleProduct() {
  const [productId, setProductId] = useState('');

  const router = useRouter();

  const { refetch } = useQuery({
    queryKey: ['product'],
    queryFn: async () => {
      return (await axios.get(`/api/products/${productId}`)).data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });

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
  );
}
