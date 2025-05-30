import SvgStoreBag from '~/icons/store_bag';
import Image from 'next/image';
import Link from 'next/link';
import { Product as ProductType } from '~/shared/types';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export function Product({ product }: { product: ProductType }) {
  const { image, title, price, id } = product;

  const queryClient = useQueryClient();

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Link
            href={`/shop/product/${id}` || '/images/products/image_base.png'}
          >
            <Image
              priority={true}
              alt="SSD"
              src={image}
              width={1920}
              height={1080}
              className="w-48 rounded-md"
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
                      await axios.post('/api/cart', {
                        ...product,
                        amount: 1,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ['NavBarProducts'],
                      });
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
