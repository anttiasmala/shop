import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useEffectAfterInitialRender } from '~/hooks/useEffectAfterInitialRender';
import { QueryAndMutationKeys } from '~/shared/types';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

export { getServerSideProps };

export default function Logout({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationKey: QueryAndMutationKeys.Logout,
    mutationFn: async () => {
      await axios.post('/api/auth/logout');
    },
    onSuccess: () => {
      // set cartSetting's isLoggedIn to true
      window.localStorage.setItem(
        'cartSettings',
        JSON.stringify({
          isLoggedIn: false,
          isCartLinked: false,
        }),
      );
      setTimeout(() => {
        router.push('/').catch((e) => console.error(e));
      }, 1000);
    },
  });

  useEffectAfterInitialRender(() => {
    async function runThis() {
      try {
        await mutateAsync();
        const cartUUID = window.localStorage.getItem('cartUUID');
        void axios.post('/api/cart/unlink-cart', {
          cartUUID: cartUUID,
          userUUID: user.uuid,
        });
      } catch (e) {
        console.error(e);
        router.push('/').catch((e) => console.error(e));
      }
    }
    void runThis();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/').catch((e) => console.error(e));
    }, 10000);

    return () => clearInterval(timeout);
  }, [router]);

  return (
    <div className="h-screen w-full">
      <div className="mt-12 flex w-full justify-center">
        <p className="text-center text-5xl font-bold">
          Kirjaudutaan ulos<span className="loading-dots absolute"></span>
        </p>
      </div>
    </div>
  );
}
