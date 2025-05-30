import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import SvgMagnifyingGlass from '~/icons/magnifying_glass';
import SvgStoreBag from '~/icons/store_bag';
import { Product } from '~/shared/types';
import { useGetProducts } from '~/utils/apiRequests';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

  const { data: products } = useGetProducts();

  useEffect(() => {
    console.log(products);
  }, [products]);

  useEffect(() => {
    if (!products) {
      setSearchedProducts([]);
      return;
    }
    const filtered = products.filter((product) => {
      const matchedSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchedSearch;
    });
    setSearchedProducts(filtered);
  }, [searchTerm, products]);

  return (
    <main className="h-screen w-full bg-white">
      <div className="flex flex-col items-center">
        <div className="sm:max-w-1/2">
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
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
              </div>
              <div className="flex flex-wrap justify-center">
                {searchTerm.length === 0
                  ? products?.map((product, index) => {
                      return (
                        <ProductBlock
                          id={product.id}
                          image={
                            product.image || '/images/products/image_base.png'
                          }
                          price={product.price}
                          title={product.title}
                          key={`product_${index}`}
                        />
                      );
                    })
                  : searchedProducts.map((product, index) => (
                      <ProductBlock
                        id={product.id}
                        image={
                          product.image || '/images/products/image_base.png'
                        }
                        price={product.price}
                        title={product.title}
                        key={`product_${index}`}
                      />
                    ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}

function ProductBlock({
  image,
  price,
  title,
  id,
}: {
  image: string;
  title: string;
  price: string;
  id: number;
}) {
  const queryClient = useQueryClient();

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center justify-between rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Link
            href={`/shop/product/${id}`}
            onClick={() => {
              queryClient.clear();
            }}
          >
            <Image
              priority={true}
              alt="SSD"
              src={image}
              width={1920}
              height={1080}
              className="h-48 w-48 rounded-md"
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
                    toast('Test', {
                      theme: 'light',
                    });
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
