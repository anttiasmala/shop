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
import { GetUser, QueryAndMutationKeys } from '~/shared/types';
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from '~/shared/zodSchemas';
import { handleError } from '~/utils/handleError';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

// ran in backend!
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

const EMPTY_ERRORS = EMPTY_FORM;

type Form = typeof EMPTY_FORM;

export default function Register() {
  const [isAccountCreationSuccess, setIsAccountCreationSuccess] =
    useState(false);
  const [formData, setFormData] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: QueryAndMutationKeys.Register,
    mutationFn: async () => await axios.post('/api/auth/register', formData),
    onSuccess: () => accountCreatedSuccesfully(),
  });

  function accountCreatedSuccesfully() {
    // set cartSetting's isLoggedIn to true
    window.localStorage.setItem(
      'cartSettings',
      JSON.stringify({
        isLoggedIn: true,
        isCartLinked: false,
      }),
    );
    setFormData(EMPTY_FORM);
    setIsAccountCreationSuccess(true);
    setTimeout(() => {
      queryClient.clear();
      router.push('/').catch((e) => console.error(e));
    }, 1000);
  }

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
      if (!checkFields()) {
        return;
      }
      await mutateAsync();
    } catch (e) {
      console.error('Login error:', e);
      handleError(e);
    }
  }

  /** If returns true all good, if false errors have been found */
  function checkFields() {
    const firstName =
      firstNameSchema.safeParse(formData.firstName).error?.issues[0].message ??
      '';
    const lastName =
      lastNameSchema.safeParse(formData.lastName).error?.issues[0].message ??
      '';
    const email =
      emailSchema.safeParse(formData.email).error?.issues[0].message ?? '';
    const password =
      passwordSchema.safeParse(formData.password).error?.issues[0].message ??
      '';
    setErrors(() => ({ firstName, lastName, email, password }));

    // if some of the fields has failed, return false
    if (firstName || lastName || email || password) {
      return false;
    }
    return true;
  }

  const EyeSVG = showPassword ? EyeOff : Eye;

  return (
    <Main>
      <NavBar user={{} as GetUser} />
      <div className="flex h-full w-full flex-col items-center">
        <p className="mt-4 mb-6 text-center text-2xl font-bold">Register</p>
        <form onSubmit={(e) => void handleSubmit(e)} className="w-72">
          <div className="mb-4">
            <label htmlFor="firstName" className="mb-2 font-bold">
              First name
            </label>
            <Input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prevValue) => ({
                  ...prevValue,
                  firstName: e.target.value,
                }))
              }
            />
            <ErrorParagraph errorText={errors.firstName} />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="mb-2 font-bold">
              Last name
            </label>
            <Input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prevValue) => ({
                  ...prevValue,
                  lastName: e.target.value,
                }))
              }
            />
            <ErrorParagraph errorText={errors.lastName} />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 font-bold">
              Email
            </label>
            <Input
              type="email"
              className="w-full rounded border border-gray-300 p-2"
              value={formData.email}
              onChange={(e) =>
                setFormData((prevValue) => ({
                  ...prevValue,
                  email: e.target.value,
                }))
              }
            />
            <ErrorParagraph errorText={errors.email} />
          </div>

          <div className="mb-4">
            <label htmlFor="Password" className="mb-2 font-bold">
              Password
            </label>
            <div className="flex rounded border bg-gray-200 has-[input:focus]:outline-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="passwordField"
                autoComplete="off"
                className="w-full rounded border-0 bg-transparent p-2 focus:outline-0"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prevValue) => ({
                    ...prevValue,
                    password: e.target.value,
                  }))
                }
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
            <ErrorParagraph errorText={errors.password} />
          </div>

          <button
            id="submitButton"
            type="submit"
            className={`button-54 button-54-submit-button w-full rounded bg-yellow-300 p-2 text-white`}
          >
            Register
          </button>
        </form>
        {isAccountCreationSuccess && (
          <div>
            <div className="fixed top-0 left-0 z-99 h-full w-full bg-black opacity-80"></div>
            <div className="absolute top-1/2 left-1/2 z-100 grid h-50 w-max -translate-x-1/2 -translate-y-1/2 items-center rounded-lg border-4 border-yellow-800 bg-gray-500 -bg-conic-0">
              <p className="text-center text-2xl wrap-anywhere">
                User created successfully!
              </p>
            </div>
          </div>
        )}
        <div className="mt-12 flex flex-col">
          <Link
            href={'/auth/login'}
            className="rounded-lg border border-black p-2 hover:bg-gray-300"
          >
            Login instead? Click here
          </Link>
        </div>
      </div>
    </Main>
  );
}

function ErrorParagraph({ errorText }: { errorText: string }) {
  if (errorText.length <= 0) {
    return null;
  }
  return <p className="text-red-500">{errorText}</p>;
}
