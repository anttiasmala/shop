import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { GetCart, QueryAndMutationKeys } from '~/shared/types';
import { useChangeProductAmount } from '~/utils/apiRequests';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';
import { Main } from '~/components/Main';
import { BASE_IMAGE_URL } from '~/utils/constants';
import { useEffectAfterInitialRender } from '~/hooks/useEffectAfterInitialRender';

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

  useEffectAfterInitialRender(() => {
    const cartUUID = window.localStorage.getItem('cartUUID');
    if (cartUUID) {
      void axios
        .post('/api/cart/update-cart', { userCartUUID: cartUUID })
        .catch((e) => console.error(e));
    }
  }, []);

  return (
    <Main>
      <NavBar user={user} productsFromParameter={products || []} />
      {products?.length === 0 || products === undefined ? (
        <EmptyCart />
      ) : (
        <NonEmptyCart products={products} />
      )}
      <Footer />
    </Main>
  );
}

function EmptyCart() {
  return (
    <div>
      <p className="p-4 text-3xl font-bold">Your Cart</p>
      <div className="mt-12 flex w-full flex-col items-center">
        <ShoppingBag className="size-16 text-gray-300" />
        <p className="mt-4 text-xl font-bold">Your cart is empty</p>
        <p className="mt-3 w-52 text-center text-sm wrap-anywhere text-gray-400">
          Looks like you haven&apos;t added any products to your cart yet
        </p>
        <Link
          href={'/products'}
          className="mt-10 rounded-lg bg-black p-2 text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function NonEmptyCart({ products }: { products: GetCart[] | undefined }) {
  const [sortedProducts, setSortedProducts] = useState<GetCart[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // sorts products from oldest -> latest
    setSortedProducts(
      products
        ?.slice(0)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ) || [],
    );
    let _subtotal = 0;
    for (const product of products || []) {
      _subtotal += Number(product.Product.price) * product.amount;
    }
    // eslint-disable-next-line
    _subtotal >= 50 ? setShippingFee(0) : setShippingFee(4.9);
    setSubTotal(_subtotal);
    setTax(_subtotal * 0.255);
    setTotal(_subtotal + (_subtotal >= 50 ? 0 : 4.9));
  }, [products]);

  if (!sortedProducts) {
    return null;
  }
  return (
    <div>
      <div className="flex flex-col items-center">
        {sortedProducts.map((_product, _index) => {
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
  const [amountOfProductBeforeBlur, setAmountOfProductBeforeBlur] = useState(
    product.amount,
  );

  const [userCartUUID, setUserCartUUID] = useState('');
  const { image, title, price } = product.Product;

  const queryClient = useQueryClient();

  useEffect(() => {
    setAmountOfProduct(product.amount);
  }, [product, setAmountOfProduct]);

  useEffect(() => {
    const cartUUID = localStorage.getItem('cartUUID');

    // if cartUUID is found from localStorage, set userCartUUID to be it
    if (cartUUID) setUserCartUUID(cartUUID);
  }, []);

  const { mutateAsync } = useChangeProductAmount({
    productId: product.Product.id,
    newAmount: amountOfProduct,
    userCartUUID: userCartUUID,
  });

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded bg-gray-100">
        <div className="flex bg-white">
          <Image
            priority={true}
            alt={`${title}ProductImage`}
            src={image || BASE_IMAGE_URL}
            width={1920}
            height={1080}
            className="w-24 rounded-md object-contain"
          />
          <div className="flex items-center">
            <div className="ml-3">
              <p className="mb-5 w-24 wrap-anywhere">{title}</p>
              <p className="w-24">${price}</p>
            </div>
            <div className="flex">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    void (async () => {
                      try {
                        setAmountOfProduct((prevValue) =>
                          prevValue === 0 ? 0 : prevValue - 1,
                        );
                        await mutateAsync();
                        await queryClient.invalidateQueries({
                          queryKey: QueryAndMutationKeys.CartProducts,
                        });
                      } catch (e) {
                        handleError(e);
                      }
                    })();
                  }}
                  className="flex size-6 items-center justify-center border border-gray-100 hover:bg-gray-300"
                >
                  <Minus className="w-4" />
                </button>
              </div>
              <input
                className="w-12 rounded border border-black pl-2"
                onChange={(e) => {
                  const numericRegex = /-?\d+(\.\d+)?/g;
                  const parsedNumber =
                    e.currentTarget.value.match(numericRegex);

                  setAmountOfProduct(Number(parsedNumber));
                }}
                onFocus={() => {
                  setAmountOfProductBeforeBlur(amountOfProduct);
                }}
                onBlur={() => {
                  void (async () => {
                    // this will prevent request sent to backend if amount of products were same
                    // so for example if user just click the input and clicks out without changing anything
                    if (amountOfProductBeforeBlur === amountOfProduct) return;
                    await mutateAsync();
                    await queryClient.invalidateQueries({
                      queryKey: QueryAndMutationKeys.CartProducts,
                    });
                  })();
                }}
                value={amountOfProduct}
              />

              <div className="flex items-center">
                <button
                  onClick={() => {
                    void (async () => {
                      try {
                        setAmountOfProduct((prevValue) => prevValue + 1);
                        await mutateAsync();
                        await queryClient.invalidateQueries({
                          queryKey: QueryAndMutationKeys.CartProducts,
                        });
                      } catch (e) {
                        handleError(e);
                      }
                    })();
                  }}
                  className="flex size-6 items-center justify-center border border-gray-100 hover:bg-gray-300"
                >
                  <Plus className="w-4" />
                </button>
              </div>

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
