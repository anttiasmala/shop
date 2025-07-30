import { Dispatch, SetStateAction } from 'react';
import { DELIVERY_METHOD } from '~/pages/cart/checkout';

export function DeliveryMethod({
  setDeliveryMethodFields,
  deliveryMethodFields,
  setSection,
}: {
  setDeliveryMethodFields: Dispatch<SetStateAction<DELIVERY_METHOD>>;
  deliveryMethodFields: DELIVERY_METHOD;

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
            name="deliveryMethod"
            id="FooBarPost"
            onChange={(e) => {
              setDeliveryMethodFields({ deliveryMethod: e.target.id });
            }}
            defaultChecked={
              deliveryMethodFields.deliveryMethod === 'FooBarPost'
            }
          />
          <label htmlFor="FooBarPost">FooBar Post</label>
        </div>
        <div className="mt-2 grid grid-cols-2">
          <input
            type="radio"
            name="deliveryMethod"
            id="HelloWorldDelivery"
            onChange={(e) => {
              setDeliveryMethodFields({ deliveryMethod: e.target.id });
            }}
            defaultChecked={
              deliveryMethodFields.deliveryMethod === 'HelloWorldDelivery'
            }
          />
          <label htmlFor="HelloWorldDelivery">HelloWorld Delivery</label>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="button-54 mr-3 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('addressInfo')}
        >
          Prev
        </button>
        <button
          className="button-54 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('payment')}
        >
          Next
        </button>
      </div>
    </form>
  );
}
