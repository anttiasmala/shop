import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Minus, Plus, ShoppingBagIcon, X } from 'lucide-react';
import { InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Footer } from '~/components/Footer';
import { Main } from '~/components/Main';
import { Modal } from '~/components/Modal';
import { NavBar } from '~/components/NavBar';
import { Product, QueryAndMutationKeys } from '~/shared/types';
import { useGetProduct } from '~/utils/apiRequests';
import { BASE_IMAGE_URL } from '~/utils/constants';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// No login required
export { getServerSideProps };

export default function HandleProduct({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [productId, setProductId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showZoomModalData, setShowZoomModalData] = useState<
    Product | undefined
  >(undefined);

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
    <Main>
      <div className="w-full">
        <NavBar user={user} />
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
                <button
                  type="button"
                  onClick={() => {
                    setShowZoomModalData(product);
                  }}
                >
                  <Image
                    priority={true}
                    alt={product.altText}
                    src={product.image || BASE_IMAGE_URL}
                    width={1920}
                    height={1080}
                    className="w-48 rounded-md object-contain"
                  />
                </button>
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
                  <div className="mt-2 w-max rounded-full bg-gray-200 p-1">
                    <Link
                      href={`/products?selectedCategories=${product.category}`}
                    >
                      {product.category}
                    </Link>
                  </div>
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
                          if (selectedAmount === 0) {
                            toast("You can't add 0 products");
                            return;
                          }
                          const cartUUID =
                            window.localStorage.getItem('cartUUID');
                          await axios.post(`/api/cart/${cartUUID}`, {
                            ...product,
                            amount: selectedAmount,
                          });
                          await queryClient.invalidateQueries({
                            queryKey: [QueryAndMutationKeys.NavBarProducts],
                          });
                          toast('Added products to your cart succesfully');
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
            {showZoomModalData && (
              <Modal closeModal={() => setShowZoomModalData(undefined)}>
                <div className="absolute -top-24 -right-7">
                  <button
                    type="button"
                    onClick={() => setShowZoomModalData(undefined)}
                  >
                    <X className="size-24 text-white" />
                  </button>
                </div>
                <a href={product.image || BASE_IMAGE_URL} target="_blank">
                  <Image
                    priority={true}
                    alt={product.altText}
                    src={product.image || BASE_IMAGE_URL}
                    blurDataURL="/images/products/image_base.png"
                    width={1920}
                    height={1080}
                  />
                </a>
              </Modal>
            )}
          </div>
        )}
      </div>
      <Footer />
    </Main>
  );
}
