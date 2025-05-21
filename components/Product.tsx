import { toast } from 'react-toastify';
import SvgStoreBag from '~/icons/store_bag';
import Image from 'next/image';

export function Product({
  image,
  price,
  title,
}: {
  image: string;
  title: string;
  price: string;
  id: number;
}) {
  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Image
            priority={true}
            alt="SSD"
            src={image}
            width={1920}
            height={1080}
            className="w-48 rounded-md"
          />
        </div>
        <div className="w-full bg-white">
          <div className="m-3 mr-5 ml-5 flex flex-col items-center text-sm text-gray-500">
            <p className="flex items-center">
              {title}
              <span className="ml-3">
                <button
                  onClick={() => {
                    toast('Test', {
                      theme: 'light',
                    });
                  }}
                >
                  <SvgStoreBag className="w-6" />
                </button>
              </span>
            </p>
            <p>{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
