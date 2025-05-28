import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Minus, Plus, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { useGetProduct } from '~/utils/apiRequests';

export default function HandleProduct() {
  const [productId, setProductId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { refetch, data: product } = useGetProduct(productId);

  useEffect(() => {
    if (!router.isReady) return;
    console.log(router.query.id);
    if (router.query.id && typeof router.query.id === 'string') {
      setProductId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (productId) void refetch();
  }, [productId, refetch]);

  return (
    <main className="h-screen w-full bg-white">
      <div className="flex flex-col items-center">
        <div className="w-full sm:max-w-1/2">
          <div className="w-full">
            <NavBar />
          </div>
          <div className="mt-16">
            <div className="ml-8 flex items-center">
              <button
                className="ml-1 rounded p-2 hover:bg-gray-200"
                onClick={() => {
                  if (window.history.length > 0) {
                    window.history.back();
                    return;
                  }
                  router.push('/shop').catch((e) => console.error(e));
                }}
              >
                <span className="flex">
                  <ArrowLeft className="mr-1 w-4" />
                  Back
                </span>
              </button>
            </div>
            {product && (
              <div className="flex flex-col items-center">
                <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded border border-gray-100">
                  <div className="m-5">
                    <Image
                      priority={true}
                      alt="SSD"
                      src={product.image}
                      width={1920}
                      height={1080}
                      className="w-48 rounded-md"
                    />
                  </div>
                </div>
                <div className="w-full bg-white">
                  <div className="m-3 mr-5 ml-5 flex flex-col justify-self-center">
                    <p className="text-2xl font-bold">
                      {product.title}
                      <span className="ml-3"></span>
                    </p>
                    <p className="mt-3 text-2xl font-bold">${product.price}</p>
                    <p className="mt-3 text-gray-500">{product.description}</p>
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Category:</p>
                      <p className="mt-2 w-max rounded-full bg-gray-200 p-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center border-t border-t-gray-200">
                    <div className="m-3 flex w-max">
                      <div className="flex border border-gray-100">
                        <button
                          onClick={() =>
                            setSelectedAmount((prevValue) =>
                              prevValue === 0 ? 0 : prevValue - 1,
                            )
                          }
                        >
                          <Minus className="w-4" />
                        </button>
                        <p className="p-6 pt-2 pb-2">{selectedAmount}</p>
                        <button
                          onClick={() =>
                            setSelectedAmount((prevValue) => prevValue + 1)
                          }
                        >
                          <Plus className="w-4" />
                        </button>
                      </div>
                      <button
                        className="ml-16 flex items-center rounded-2xl bg-black p-2 text-white"
                        onClick={() => {
                          void (async () => {
                            try {
                              if (selectedAmount === 0) return;
                              await axios.post('/api/cart', {
                                ...product,
                                amount: selectedAmount,
                              });
                              await queryClient.invalidateQueries({
                                queryKey: ['NavBarProducts'],
                              });
                            } catch (e) {
                              console.error(e);
                            }
                          })();
                        }}
                      >
                        <ShoppingBagIcon className="mr-3 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
