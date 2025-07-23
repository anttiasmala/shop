import SvgStoreBag from '~/icons/store_bag';
import Image from 'next/image';
import Link from 'next/link';
import { Product as ProductType, QueryAndMutationKeys } from '~/shared/types';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { handleError } from '~/utils/handleError';
import { BASE_IMAGE_URL } from '~/utils/constants';

export function Product({ product }: { product: ProductType }) {
  const { image, title, price, id, altText } = product;

  const queryClient = useQueryClient();

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center justify-between rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Link href={`/product/${id}`}>
            <Image
              priority={true}
              alt={altText}
              src={image || BASE_IMAGE_URL}
              width={1920}
              height={1080}
              className="h-48 w-48 rounded-md object-contain"
            />
          </Link>
        </div>
        <div className="w-full bg-white">
          <div className="m-3 mr-5 ml-5 flex flex-col items-center text-sm text-gray-500">
            <p className="flex items-center">
              {title}
              <span className="ml-3">
                <button
                  onClick={() => {
                    void (async () => {
                      try {
                        const uuid =
                          window.localStorage.getItem('cartUUID') || '';
                        await axios.post(`/api/cart/${uuid}`, {
                          ...product,
                          amount: 1,
                        });
                        await queryClient.invalidateQueries({
                          queryKey: [QueryAndMutationKeys.NavBarProducts],
                        });
                        toast('Added products to your cart succesfully');
                      } catch (e) {
                        handleError(e);
                      }
                    })();
                  }}
                >
                  <SvgStoreBag className="w-6" />
                </button>
              </span>
            </p>
            <p>${price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
