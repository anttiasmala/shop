import { QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import SvgStoreBag from '~/icons/store_bag';
import { GetCart, Product, QueryAndMutationKeys } from '~/shared/types';
import { useGetProducts } from '~/utils/apiRequests';

export default function Cart() {
  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.CartProducts,
    queryFn: async () => {
      return (await axios.get(`/api/cart`)).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      {products?.length === 0 ? (
        <EmptyCart />
      ) : (
        <NonEmptyCart products={products} />
      )}
      <Footer />
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="">
      <p className="p-4 text-3xl font-bold">Your Cart</p>
      <div className="mt-12 flex w-full flex-col items-center">
        <ShoppingBag className="size-16 text-gray-300" />
        <p className="mt-4 text-xl font-bold">Your cart is empty</p>
        <p className="mt-3 w-52 text-center text-sm wrap-anywhere text-gray-400">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link
          href={'/shop/products'}
          className="mt-10 rounded-lg bg-black p-2 text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function NonEmptyCart({ products }: { products: GetCart[] | undefined }) {
  if (!products) {
    return null;
  }
  return (
    <div>
      <div>
        {products.map((_product, _index) => {
          return (
            <ProductBlock product={_product} key={`productBlock${_index}`} />
          );
        })}
      </div>
    </div>
  );
}

function ProductBlock({ product }: { product: GetCart }) {
  const [amountOfProduct, setAmountOfProduct] = useState(product.amount);
  const { image, title, price } = product.Product;

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded bg-gray-100">
        <div className="flex bg-white">
          <Image
            priority={true}
            alt={`${title}ProductImage`}
            src={image}
            width={1920}
            height={1080}
            className="w-24 rounded-md"
          />
          <div className="flex items-center">
            <div className="ml-3">
              <p className="mb-5 w-24 wrap-anywhere">{title}</p>
              <p className="w-24">${price}</p>
            </div>
            <div className="flex">
              <button
                onClick={() =>
                  setAmountOfProduct((prevValue) =>
                    prevValue === 0 ? 0 : prevValue - 1,
                  )
                }
                className="border border-gray-100"
              >
                <Minus className="w-4" />
              </button>
              <p className="p-6 pt-2 pb-2">{amountOfProduct}</p>
              <button
                onClick={() => setAmountOfProduct((prevValue) => prevValue + 1)}
                className="border border-gray-100"
              >
                <Plus className="w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
