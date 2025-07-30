import { Dispatch, SetStateAction } from 'react';
import { Input } from '../Input';

export function AddressInfo({
  setAddressInfoFields,
  addressInfoFields,
  setSection,
}: {
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

  setSection: Dispatch<
    SetStateAction<
      'userDetails' | 'addressInfo' | 'deliveryMethod' | 'payment' | 'review'
    >
  >;
}) {
  return (
    <form>
      <div className="mt-3 flex flex-col">
        <label>Address:</label>
        <Input
          name="address"
          type="text"
          onChange={(e) =>
            setAddressInfoFields((prevValue) => ({
              ...prevValue,
              address: e.target.value,
            }))
          }
          value={addressInfoFields.address}
        />
      </div>
      <div className="mt-3 flex flex-col">
        <label>Postal service location:</label>
        <Input
          name="postalServiceLocation"
          type="text"
          value={addressInfoFields.postalServiceLocation}
          onChange={(e) =>
            setAddressInfoFields((prevValue) => ({
              ...prevValue,
              postalServiceLocation: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-3 flex flex-col">
        <label>Zip code:</label>
        <Input
          name="zipCode"
          type="text"
          value={addressInfoFields.zipCode}
          onChange={(e) =>
            setAddressInfoFields((prevValue) => ({
              ...prevValue,
              zipCode: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="button-54 mr-3 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('userDetails')}
        >
          Prev
        </button>
        <button
          className="button-54 w-1/2 bg-gray-400 hover:bg-gray-500"
          type="button"
          onClick={() => setSection('deliveryMethod')}
        >
          Next
        </button>
      </div>
    </form>
  );
}
