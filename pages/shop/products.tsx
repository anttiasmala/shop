import Image from 'next/image';
import { toast } from 'react-toastify';
import { Container } from '~/components/Container';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import { TextCard } from '~/components/TextCard';
import SvgMagnifyingGlass from '~/icons/magnifying_glass';
import SvgStoreBag from '~/icons/store_bag';
import { arrayOfProducts } from '~/utils/debug';

export default function Products() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      <div>
        <p className="m-6 text-3xl font-bold">All Products</p>
        <div>
          <div className="m-6 flex flex-wrap rounded-2xl border border-gray-200">
            <SvgMagnifyingGlass className="ml-4 w-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-max p-3 pr-0"
            />
          </div>
          <div className="flex flex-wrap justify-center">
            {arrayOfProducts.map((value, index) => {
              return (
                <Product
                  image={value.image}
                  price={value.price}
                  title={value.title}
                  key={`product_${index}`}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Product({
  image,
  price,
  title,
}: {
  image: string;
  title: string;
  price: string;
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
