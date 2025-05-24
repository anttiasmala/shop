import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { Product, QueryAndMutationKeys } from '~/shared/types';
import { useGetProducts } from '~/utils/apiRequests';

export default function Cart() {
  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.CartProducts,
    queryFn: async () => {
      return (await axios.get(`/api/cart`)).data as Product[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      {products?.length === 0 ? (
        <EmptyCart />
      ) : (
        <div>You have {products?.length} products!</div>
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
