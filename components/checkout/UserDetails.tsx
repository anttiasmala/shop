import { Dispatch, SetStateAction } from 'react';
import { Input } from '../Input';

export function UserDetails({
  setUserDetailsFields,
  userDetailsFields,
  setSection,
}: {
  setUserDetailsFields: Dispatch<
    SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
    }>
  >;
  userDetailsFields: {
    firstName: string;
    lastName: string;
    email: string;
  };
  setSection: Dispatch<
    SetStateAction<
      'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
    >
  >;
}) {
  return (
    <form>
      <div className="mt-3 flex flex-col">
        <label>First name:</label>
        <Input
          name="firstName"
          type="text"
          onChange={(e) =>
            setUserDetailsFields((prevValue) => ({
              ...prevValue,
              firstName: e.target.value,
            }))
          }
          value={userDetailsFields.firstName}
        />
      </div>
      <div className="mt-3 flex flex-col">
        <label>Last name:</label>
        <Input
          name="lastName"
          type="text"
          value={userDetailsFields.lastName}
          onChange={(e) =>
            setUserDetailsFields((prevValue) => ({
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
          value={userDetailsFields.email}
          onChange={(e) =>
            setUserDetailsFields((prevValue) => ({
              ...prevValue,
              email: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="button-54 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('addressInfo')}
        >
          Next
        </button>
      </div>
    </form>
  );
}
