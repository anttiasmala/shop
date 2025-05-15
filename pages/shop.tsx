import Image from 'next/image';
import { useEffect, useState } from 'react';
import SvgLogo from '~/icons/logo';
import { Product } from '~/shared/types';

const TEST_ARRAY: Product[] = [
  {
    title: 'Mocha',
    price: '3.90€',
    description:
      'A caffè mocha, is a chocolate-flavoured variant of caffè latte',
    amount: 0,
    id: 0,
  },
  {
    title: 'Flat White',
    price: '3.60€',
    description: 'A caffè Flat White',
    amount: 0,
    id: 1,
  },
];

export default function Home() {
  return (
    <main className="h-screen w-full bg-orange-300">
      <div className="flex justify-center border-2 border-black text-5xl font-bold">
        KAHVITUPA
      </div>
      <div className="grid justify-center">
        <div className="mr-10 ml-10 grid grid-cols-1 md:w-128">
          <ProductBlock />

          <div className="mb-10"></div>
        </div>
      </div>
    </main>
  );
}

function ProductBlock() {
  const [arrayOfProducts, setArrayOfProducts] = useState<Product[]>(TEST_ARRAY);

  return arrayOfProducts.map((value, index) => {
    return (
      <div key={index} className="mt-10 flex min-h-48 w-full rounded bg-white">
        <SvgLogo className="w-24 border-r-2 border-black" />
        <div className="flex h-full w-full flex-col items-center">
          <p className="text-lg">{value.title}</p>
          <p className="mt-1 rounded-lg bg-green-500 text-lg font-bold">
            {value.price}
          </p>
          <p className="m-2 mb-0 wrap-anywhere">{value.description}</p>
          <div className="flex items-center text-2xl">
            <button
              className="mr-3 flex size-6 items-center justify-center rounded border border-black bg-green-500"
              onClick={() => {
                setArrayOfProducts((prevValue) =>
                  prevValue.map((_item) =>
                    _item.id === value.id && _item.amount > 0
                      ? { ..._item, amount: _item.amount - 1 }
                      : _item,
                  ),
                );
              }}
            >
              -
            </button>
            <p>{value.amount}</p>
            <button
              className="ml-3 flex size-6 items-center justify-center rounded border border-black bg-green-500"
              onClick={() => {
                setArrayOfProducts((prevValue) =>
                  prevValue.map((_item) =>
                    _item.id === value.id
                      ? { ..._item, amount: _item.amount + 1 }
                      : _item,
                  ),
                );
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  });
}
