import { InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { Input } from '~/components/Input';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import { GetUser } from '~/shared/types';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// Does not require login
export { getServerSideProps };

const FIELDS = {
  firstName: '',
  lastName: '',
  email: '',
};

const FIELD_ERRORS = {
  firstName: '',
  lastName: '',
  email: '',
};

export default function Checkout({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [inputFields, setInputFields] = useState<typeof FIELDS>(FIELDS);
  const [fieldErrors, setFieldErrors] =
    useState<typeof FIELD_ERRORS>(FIELD_ERRORS);

  useEffect(() => {
    if (!user) return;

    setInputFields({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [user]);

  return (
    <Main>
      <NavBar user={user} />
      <div>
        <div className="flex justify-center">
          <form>
            <div className="mt-3 flex flex-col">
              <label>First name:</label>
              <Input
                name="firstName"
                type="text"
                onChange={(e) =>
                  setInputFields((prevValue) => ({
                    ...prevValue,
                    firstName: e.target.value,
                  }))
                }
                value={inputFields.firstName}
              />
            </div>
            <div className="mt-3 flex flex-col">
              <label>Last name:</label>
              <Input
                name="lastName"
                type="text"
                value={inputFields.lastName}
                onChange={(e) =>
                  setInputFields((prevValue) => ({
                    ...prevValue,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-3 flex flex-col">
              <label>Email:</label>
              <Input
                name="email"
                type="email"
                value={inputFields.email}
                onChange={(e) =>
                  setInputFields((prevValue) => ({
                    ...prevValue,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-5 flex justify-center">
              <button className="button-54 w-full bg-gray-400 hover:bg-gray-500">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </Main>
  );
}
