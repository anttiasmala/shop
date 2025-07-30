import { InferGetServerSidePropsType } from 'next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AddressInfo } from '~/components/checkout/AddressInfo';
import { DeliveryMethod } from '~/components/checkout/DeliveryMethod';
import { Payment } from '~/components/checkout/Payment';
import { Review } from '~/components/checkout/Review';
import { UserDetails } from '~/components/checkout/UserDetails';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// Does not require login
export { getServerSideProps };

const USER_DETAILS = {
  firstName: '',
  lastName: '',
  email: '',
};

const ADDRESS_INFO = {
  address: '',
  zipCode: '',
  postalServiceLocation: '',
};

export type DELIVERY_METHOD = {
  deliveryMethod: 'FooBarPost' | 'HelloWorldDelivery' | (string & {});
  deliveryDate?: Date;
};

export type PAYMENT = {
  paymentMethod: 'FooBarPayment' | 'HelloWorldPay' | (string & {});
};

const FIELD_ERRORS = {
  firstName: '',
  lastName: '',
  email: '',
};

export default function Checkout({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [userDetailsFields, setUserDetailsFields] =
    useState<typeof USER_DETAILS>(USER_DETAILS);
  const [addressInfoFields, setAddressInfoFields] =
    useState<typeof ADDRESS_INFO>(ADDRESS_INFO);
  const [deliveryMethodFields, setDeliveryMethodFields] =
    useState<DELIVERY_METHOD>({ deliveryMethod: '' });
  const [paymentFields, setPaymentFields] = useState<PAYMENT>({
    paymentMethod: '',
  });
  const [section, setSection] = useState<
    'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
  >('userDetails');

  useEffect(() => {
    if (!user) return;

    setUserDetailsFields({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [user]);

  return (
    <Main>
      <NavBar user={user} />
      <div>
        <div>
          <div className={`relative ${section === 'review' ? 'hidden' : ''}`}>
            <div className="absolute">
              <div
                className={`flex before:border-2 sm:after:content-['User_details'] ${section === 'userDetails' ? 'before:border-green-500' : ''}`}
              >
                <p>1&nbsp;</p>
              </div>
              <div
                className={`flex before:border-2 sm:after:content-['Address_info'] ${section === 'addressInfo' ? 'before:border-green-500' : ''}`}
              >
                <p>2&nbsp;</p>
              </div>
              <div
                className={`flex before:border-2 sm:after:content-['Delivery_method'] ${section === 'deliveryMethod' ? 'before:border-green-500' : ''}`}
              >
                <p>3&nbsp;</p>
              </div>
              <div
                className={`flex before:border-2 sm:after:content-['Payment'] ${section === 'payment' ? 'before:border-green-500' : ''}`}
              >
                <p>4&nbsp;</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Section
              section={section}
              setUserDetailsFields={setUserDetailsFields}
              userDetailsFields={userDetailsFields}
              setSection={setSection}
              setAddressInfoFields={setAddressInfoFields}
              addressInfoFields={addressInfoFields}
              setDeliveryMethodFields={setDeliveryMethodFields}
              deliveryMethodFields={deliveryMethodFields}
              setPaymentFields={setPaymentFields}
              paymentFields={paymentFields}
            />
          </div>
        </div>
      </div>
    </Main>
  );
}

function Section({
  section,
  setSection,
  setUserDetailsFields,
  userDetailsFields,
  addressInfoFields,
  setAddressInfoFields,
  setDeliveryMethodFields,
  deliveryMethodFields,
  setPaymentFields,
  paymentFields,
}: {
  section:
    | 'userDetails'
    | 'addressInfo'
    | 'deliveryMethod'
    | 'payment'
    | 'review';
  setSection: Dispatch<
    SetStateAction<
      'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
    >
  >;
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
  setAddressInfoFields: Dispatch<
    SetStateAction<{
      address: string;
      zipCode: string;
      postalServiceLocation: string;
    }>
  >;
  addressInfoFields: {
    address: string;
    zipCode: string;
    postalServiceLocation: string;
  };
  setDeliveryMethodFields: Dispatch<SetStateAction<DELIVERY_METHOD>>;
  deliveryMethodFields: DELIVERY_METHOD;
  setPaymentFields: Dispatch<SetStateAction<PAYMENT>>;
  paymentFields: PAYMENT;
}) {
  switch (section) {
    case 'userDetails':
      return (
        <UserDetails
          setUserDetailsFields={setUserDetailsFields}
          userDetailsFields={userDetailsFields}
          setSection={setSection}
        />
      );
    case 'addressInfo':
      return (
        <AddressInfo
          addressInfoFields={addressInfoFields}
          setAddressInfoFields={setAddressInfoFields}
          setSection={setSection}
        />
      );

    case 'deliveryMethod':
      return (
        <DeliveryMethod
          deliveryMethodFields={deliveryMethodFields}
          setDeliveryMethodFields={setDeliveryMethodFields}
          setSection={setSection}
        />
      );
    case 'payment':
      return (
        <Payment
          setSection={setSection}
          setPaymentFields={setPaymentFields}
          paymentFields={paymentFields}
        />
      );
    case 'review':
      return (
        <Review
          addressInfoFields={addressInfoFields}
          deliveryMethodFields={deliveryMethodFields}
          paymentFields={paymentFields}
          userDetailsFields={userDetailsFields}
          setSection={setSection}
        />
      );
  }
}
