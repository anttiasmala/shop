import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { validateRequest } from '~/backend/auth/auth';
import { Input } from '~/components/Input';
import { QueryAndMutationKeys, UserLoginDetails } from '~/shared/types';
import { emailSchema } from '~/shared/zodSchemas';
import { handleError } from '~/utils/handleError';

const EMPTY_ERRORS = {
  email: '',
  password: '',
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookieData = await validateRequest(context.req, context.res);
  if (!cookieData.user || !cookieData.session.isLoggedIn) {
    return {
      props: {},
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/shop',
    },
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, error } = useMutation({
    mutationKey: QueryAndMutationKeys.Login,
    mutationFn: async (loginCredentials: UserLoginDetails) =>
      await axios.post('/api/auth/login', loginCredentials),

    onSuccess: () => {
      queryClient.clear();
      router.push('/shop').catch((e) => console.error(e));

      // set cartSetting's isLoggedIn to true
      window.localStorage.setItem(
        'cartSettings',
        JSON.stringify({
          isLoggedIn: true,
          isCartLinked: false,
        }),
      );
    },
  });

  useEffect(() => {
    toast(error?.message);
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // clear the errors
      setErrors(EMPTY_ERRORS);
      // error found stop the logging process
      if (checkFields() === true) {
        return;
      }
      await mutateAsync({ email, password });
    } catch (e) {
      console.error('Login error:', e);
      handleError(e);
    }
  }

  function checkFields() {
    let errorFound = false;
    if (password.length <= 0) {
      setErrors((prevValue) => ({
        ...prevValue,
        password: 'Salasana on pakollinen',
      }));
      errorFound = true;
    }

    const emailParse = emailSchema.safeParse(email);
    if (emailParse.success === false) {
      setErrors((prevValue) => ({
        ...prevValue,
        email: emailParse.error.errors[0].message,
      }));
      errorFound = true;
    }

    return errorFound;
  }

  return (
    <main className="h-screen w-full">
      <div className="flex h-full w-full flex-col items-center">
        <p className="mb-6 text-center text-2xl font-bold">Login</p>
        <form onSubmit={(e) => void handleSubmit(e)} className="w-72">
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 font-bold">
              Email
            </label>
            <Input
              type="email"
              className="w-full rounded border border-gray-300 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 font-bold">
              Password
            </label>
            <Input
              type="password"
              autoComplete="off"
              className="w-full rounded border border-gray-300 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className={`button-54 w-full rounded bg-yellow-300 p-2 text-white`}
          >
            Login
          </button>
        </form>
        <div className="mt-12 flex flex-col">
          <Link
            href={'/auth/register'}
            className="rounded-lg border border-black p-2 hover:bg-gray-300"
          >
            Register instead? Click here
          </Link>
        </div>
      </div>
    </main>
  );
}
