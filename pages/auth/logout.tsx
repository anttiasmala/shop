import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryAndMutationKeys } from '~/shared/types';

export default function Logout() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationKey: QueryAndMutationKeys.Logout,
    mutationFn: async () => {
      await axios.post('/api/auth/logout');
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push('/shop').catch((e) => console.error(e));
      }, 1000);
    },
  });

  useEffect(() => {
    mutateAsync();
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="mt-12 flex w-full justify-center">
        <p className="text-5xl font-bold">
          Kirjaudutaan ulos<span className="loading-dots absolute"></span>
        </p>
      </div>
    </div>
  );
}
