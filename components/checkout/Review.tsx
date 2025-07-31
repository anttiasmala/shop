import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { DELIVERY_METHOD, PAYMENT } from '~/pages/cart/checkout';
import { GetCart, QueryAndMutationKeys } from '~/shared/types';
import { handleError } from '~/utils/handleError';

const DELIVERY_METHOD_PARSER = {
  FooBarPost: 'Foo Bar Post',
  HelloWorldDelivery: 'Hello World Delivery',
} as const;

const PAYMENT_METHOD_PARSER = {
  FooBarPayment: 'Foo Bar Payment',
  HelloWorldPay: 'Hello World Pay',
};

export function Review({
  addressInfoFields,
  deliveryMethodFields,
  paymentFields,
  userDetailsFields,
  setSection,
}: {
  userDetailsFields: {
    firstName: string;
    lastName: string;
    email: string;
  };
  addressInfoFields: {
    address: string;
    zipCode: string;
    postalServiceLocation: string;
  };
  deliveryMethodFields: DELIVERY_METHOD;
  paymentFields: PAYMENT;
  setSection: Dispatch<
    SetStateAction<
      'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
    >
  >;
}) {
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);

  const router = useRouter();

  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.ReviewCartProducts,
    queryFn: async () => {
      const cartUUID = window.localStorage.getItem('cartUUID');
      return (await axios.get(`/api/cart/${cartUUID}`)).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: QueryAndMutationKeys.Checkout,
    mutationFn: async () =>
      await axios.post(`/api/checkout`, {
        purchaseDetails: {
          ...userDetailsFields,
          ...addressInfoFields,
          ...deliveryMethodFields,
          ...paymentFields,
        },
        cartItems: {
          ...products,
        },
      }),
    onSuccess: () => {
      setIsRequestSuccessful(true);
      setTimeout(() => {
        router.push('/').catch((e) => console.error(e));
      }, 1000);
    },
  });

  return (
    <div>
      <div className="flex flex-col justify-start">
        <p className="text-lg font-bold">User details</p>
        <p>
          First name:{' '}
          <span className="font-bold">{userDetailsFields.firstName}</span>
        </p>
        <p>
          Last name:{' '}
          <span className="font-bold">{userDetailsFields.lastName}</span>
        </p>
        <p>
          Email: <span className="font-bold">{userDetailsFields.email}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold">Address Information</p>
        <p>
          Address:{' '}
          <span className="font-bold">{addressInfoFields.address}</span>
        </p>
        <p>
          Postal service location:{' '}
          <span className="font-bold">
            {addressInfoFields.postalServiceLocation}
          </span>
        </p>
        <p>
          Zip code:{' '}
          <span className="font-bold">{addressInfoFields.zipCode}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold">Delivery Method</p>
        <p>
          Delivery method:{' '}
          <span className="font-bold">
            {
              DELIVERY_METHOD_PARSER[
                deliveryMethodFields.deliveryMethod as keyof typeof DELIVERY_METHOD_PARSER
              ]
            }
          </span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold">Payment Method</p>
        <p>
          Payment method:{' '}
          <span className="font-bold">
            {
              PAYMENT_METHOD_PARSER[
                paymentFields.paymentMethod as keyof typeof PAYMENT_METHOD_PARSER
              ]
            }
          </span>
        </p>
      </div>

      <div className="mt-10">
        <p>Everything allright, continue with purchase?</p>
        <div className="mt-4">
          <button
            className="button-54 w-36 bg-gray-500 hover:bg-gray-600"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSection('payment');
            }}
          >
            Go back
          </button>
          <button
            className="button-54 ml-3 w-36 bg-gray-500 hover:bg-gray-600"
            type="button"
            onClick={() => {
              try {
                mutateAsync();
              } catch (e) {
                handleError(e);
              }
            }}
          >
            Purchase
          </button>
        </div>
      </div>
      {isRequestSuccessful && (
        <div>
          <div className="fixed top-0 left-0 z-99 h-full w-full bg-black opacity-80"></div>
          <div className="absolute top-1/2 left-1/2 z-100 grid h-50 w-max -translate-x-1/2 -translate-y-1/2 items-center rounded-lg border-4 border-yellow-800 bg-gray-500 -bg-conic-0">
            <p className="text-center text-2xl wrap-anywhere">
              Purchase done succesfully!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
