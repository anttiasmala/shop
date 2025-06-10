import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { DeleteCartItem, GetCart, QueryAndMutationKeys } from '~/shared/types';
import { useChangeProductAmount } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// Does not require login
export { getServerSideProps };

export default function Cart({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.CartProducts,
    queryFn: async () => {
      const cartUUID = window.localStorage.getItem('cartUUID');
      return (await axios.get(`/api/cart/${cartUUID}`)).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full flex-col items-center">
        <div className="w-full sm:max-w-1/2">
          <div className="w-full">
            <NavBar user={user} />
          </div>
          {products?.length === 0 ? (
            <EmptyCart />
          ) : (
            <NonEmptyCart products={products} />
          )}
          <Footer />
        </div>
      </div>
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
          Looks like you haven&apos;t added any products to your cart yet
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
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const { data } = useQuery({
    queryKey: QueryAndMutationKeys.UpdateCartTotalAmount,
    queryFn: async () => {
      const cartUUID = window.localStorage.getItem('cartUUID');
      return (await axios.get(`/api/cart/${cartUUID}`)).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  useEffect(() => {
    let _subtotal = 0;
    for (const product of data || []) {
      _subtotal += Number(product.Product.price) * product.amount;
    }
    // eslint-disable-next-line
    _subtotal >= 50 ? setShippingFee(0) : setShippingFee(4.9);
    setSubTotal(_subtotal);
    setTax(_subtotal * 0.255);
    setTotal(_subtotal + (_subtotal >= 50 ? 0 : 4.9));
  }, [data]);

  if (!products) {
    return null;
  }
  return (
    <div>
      <div className="flex flex-col items-center">
        {products.map((_product, _index) => {
          return (
            <ProductBlock product={_product} key={`productBlock${_index}`} />
          );
        })}
        <div className="mt-5 mr-3 ml-3 flex flex-col border border-gray-100 sm:w-96">
          <p className="p-4 font-bold">Order Summary</p>
          <div className="m-4">
            <p className="flex justify-between">
              Subtotal: <span className="mr-10">${subTotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              Shipping:{' '}
              <span className="mr-10">
                {shippingFee === 0 ? 'Free' : `$${shippingFee.toString()}`}
              </span>
            </p>
            <p className="flex justify-between">
              Tax: <span className="mr-10">${tax.toFixed(2)}</span>
            </p>
          </div>
          <div className="m-4 border-t border-gray-100 text-xl">
            <p className="flex justify-between font-bold">
              Total <span className="mr-10">${total.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex w-full justify-center">
            <button className="mt-4 w-48 rounded-md bg-black p-2 text-white">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBlock({ product }: { product: GetCart }) {
  const [amountOfProduct, setAmountOfProduct] = useState(product.amount);
  const { image, title, price } = product.Product;

  const queryClient = useQueryClient();

  useEffect(() => {
    setAmountOfProduct(product.amount);
  }, [product, setAmountOfProduct]);

  const { mutateAsync } = useChangeProductAmount(
    product.Product.id,
    amountOfProduct,
  );

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded bg-gray-100">
        <div className="flex bg-white">
          <Image
            priority={true}
            alt={`${title}ProductImage`}
            src={image || '/images/products/image_base.png'}
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
                onClick={() => {
                  void (async () => {
                    try {
                      if (amountOfProduct === 1) {
                        return;
                      }
                      setAmountOfProduct((prevValue) =>
                        prevValue === 0 ? 0 : prevValue - 1,
                      );
                      await mutateAsync();
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.NavBarProducts,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.UpdateCartTotalAmount,
                      });
                    } catch (e) {
                      handleError(e);
                    }
                  })();
                }}
                className="border border-gray-100"
              >
                <Minus className="w-4" />
              </button>
              <p className="p-6 pt-2 pb-2">{amountOfProduct}</p>
              <button
                onClick={() => {
                  void (async () => {
                    try {
                      setAmountOfProduct((prevValue) => prevValue + 1);
                      await mutateAsync();
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.NavBarProducts,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.UpdateCartTotalAmount,
                      });
                    } catch (e) {
                      handleError(e);
                    }
                  })();
                }}
                className="border border-gray-100"
              >
                <Plus className="w-4" />
              </button>

              <button
                className="ml-8"
                onClick={() => {
                  void (async () => {
                    try {
                      const cartUUID = window.localStorage.getItem('cartUUID');
                      await axios.delete(`/api/cart/${cartUUID}`, {
                        data: {
                          productId: product.Product.id.toString(),
                        },
                      });
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.NavBarProducts,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.UpdateCartTotalAmount,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: QueryAndMutationKeys.CartProducts,
                      });
                      toast('Removed product from your cart succesfully');
                    } catch (e) {
                      handleError(e);
                    }
                  })();
                }}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
