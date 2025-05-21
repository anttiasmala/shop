import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HandleProduct() {
  const { refetch } = useQuery({
    queryKey: ['product'],
    queryFn: async () => {
      return (await axios.get(`/api/products`)).data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });

  return (
    <div>
      <p>Hello</p>
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
