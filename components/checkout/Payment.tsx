import { Dispatch, SetStateAction } from 'react';
import { PAYMENT } from '~/pages/cart/checkout';

export function Payment({
  setPaymentFields,
  paymentFields,
  setSection,
}: {
  setPaymentFields: Dispatch<SetStateAction<PAYMENT>>;
  paymentFields: PAYMENT;

  setSection: Dispatch<
    SetStateAction<
      'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
    >
  >;
}) {
  return (
    <form>
      <div className="mt-3 flex flex-col">
        <div className="grid grid-cols-2">
          <input
            type="radio"
            name="paymentMethod"
            id="FooBarPayment"
            onChange={(e) => {
              setPaymentFields({ paymentMethod: e.target.id });
            }}
            defaultChecked={paymentFields.paymentMethod === 'FooBarPayment'}
          />
          <label htmlFor="FooBar">FooBar Payment</label>
        </div>
        <div className="mt-2 grid grid-cols-2">
          <input
            type="radio"
            name="paymentMethod"
            id="HelloWorldPay"
            onChange={(e) => {
              setPaymentFields({ paymentMethod: e.target.id });
            }}
            defaultChecked={paymentFields.paymentMethod === 'HelloWorldPay'}
          />
          <label htmlFor="HelloWorld">HelloWorld Pay</label>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="button-54 mr-3 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('deliveryMethod')}
        >
          Prev
        </button>
        <button
          className="button-54 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('review')}
        >
          Next
        </button>
      </div>
    </form>
  );
}
