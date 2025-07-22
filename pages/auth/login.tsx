import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { validateRequest } from '~/backend/auth/auth';
import { Input } from '~/components/Input';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import {
  GetUser,
  QueryAndMutationKeys,
  UserLoginDetails,
} from '~/shared/types';
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
      destination: '/',
    },
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: QueryAndMutationKeys.Login,
    mutationFn: async (loginCredentials: UserLoginDetails) =>
      await axios.post('/api/auth/login', loginCredentials),

    onSuccess: () => {
      queryClient.clear();
      router.push('/').catch((e) => console.error(e));

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      document.getElementById('submitButton')?.focus();
      setTimeout(() => {
        document.getElementById('passwordField')?.focus();
      }, 100);

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
        password: 'Password is mandatory',
      }));
      errorFound = true;
    }

    const emailParse = emailSchema.safeParse(email);
    if (emailParse.success === false) {
      setErrors((prevValue) => ({
        ...prevValue,
        email: emailParse.error.issues[0].message,
      }));
      errorFound = true;
    }

    return errorFound;
  }

  const EyeSVG = showPassword ? EyeOff : Eye;

  return (
    <Main>
      <NavBar user={{} as GetUser} />
      <div className="flex h-full w-full flex-col items-center">
        <p className="mt-4 mb-6 text-center text-2xl font-bold">Login</p>
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
            <div className="flex rounded border bg-gray-200 has-[input:focus]:outline-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="passwordField"
                autoComplete="off"
                className="w-full rounded border-0 bg-transparent p-2 focus:outline-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-center">
                <button
                  className="hover:text-gray-600"
                  type="button"
                  onClick={() => setShowPassword((prevValue) => !prevValue)}
                >
                  <EyeSVG className="size-8" />
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            id="submitButton"
            type="submit"
            className={`button-54 button-54-submit-button w-full rounded bg-yellow-300 p-2 text-white`}
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
    </Main>
  );
}
