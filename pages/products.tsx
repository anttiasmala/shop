import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Footer } from '~/components/Footer';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import SvgMagnifyingGlass from '~/icons/magnifying_glass';
import SvgStoreBag from '~/icons/store_bag';
import { Product, QueryAndMutationKeys } from '~/shared/types';
import { useGetProducts } from '~/utils/apiRequests';
import { BASE_IMAGE_URL } from '~/utils/constants';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// No login required
export { getServerSideProps };

const SORT_BY_POSSIBILITIES = {
  Default: 'default',
  'Lowest Price': 'cheapest',
  'Highest Price': 'mostExpensive',
  Alphabet: 'alphabet',
} as const;

export default function Products({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [categoryTerm, setCategoryTerm] = useState<string[]>([]);
  const [sortProductsBy, setSortProductsBy] = useState<
    'cheapest' | 'mostExpensive' | 'alphabet' | 'default'
  >('default');

  const { data: products } = useGetProducts();

  useEffect(() => {
    console.log(products);
    const array: string[] = [];
    products?.forEach((value) => array.push(value.category));
    setCategoryList([...new Set(array)]);
  }, [products]);

  useEffect(() => {
    if (!products) {
      setSearchedProducts([]);
      return;
    }
    const filteredProducts = products.filter((product) => {
      const matchedSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchedCategory =
        categoryTerm.length === 0
          ? true
          : categoryTerm.includes(product.category);
      return matchedSearch && matchedCategory;
    });
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortProductsBy) {
        case 'alphabet':
          return a.title.localeCompare(b.title);
        case 'cheapest':
          return Number(a.price) - Number(b.price);
        case 'mostExpensive':
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });
    setSearchedProducts(sortedProducts);
  }, [searchTerm, products, categoryTerm, sortProductsBy]);

  return (
    <Main>
      <div className="w-full">
        <NavBar user={user} />
      </div>
      <div>
        <p className="m-6 text-3xl font-bold">All Products</p>
        <div>
          <div className="m-6 mb-0 flex rounded-2xl border border-gray-200">
            <SvgMagnifyingGlass className="ml-4 w-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 pr-0"
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>
          <div className="mt-1 mb-3 flex justify-center">
            <p>Products found: {searchedProducts.length}</p>
          </div>
          <div className="flex justify-between">
            <div className="ml-3 sm:ml-0">
              <p className="text-2xl">Categories:</p>
              {categoryList?.map((_category, _index) => (
                <div key={`category_${_index}`}>
                  <label className="ml-2">
                    <input
                      type="checkbox"
                      className="hover:cursor-pointer"
                      name={_category}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategoryTerm((prevValue) => [
                            ...prevValue,
                            e.target.name,
                          ]);
                        } else {
                          setCategoryTerm((prevValue) =>
                            prevValue.filter(
                              (category) => category !== e.target.name,
                            ),
                          );
                        }
                      }}
                    />
                    <span className="ml-1 cursor-pointer select-none">
                      {_category}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mr-3 sm:ml-0">
              <p>Sort by:</p>
              <select
                onChange={(e) => {
                  setSortProductsBy(
                    SORT_BY_POSSIBILITIES[
                      e.target.value as keyof typeof SORT_BY_POSSIBILITIES
                    ],
                  );
                }}
              >
                <option>Default</option>
                <option>Alphabet</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            {searchedProducts.map((product, index) => {
              return (
                <ProductBlock product={product} key={`product_${index}`} />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </Main>
  );
}

function ProductBlock({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const { id, image, title, price } = product;

  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center justify-between rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Link
            href={`/product/${id}`}
            onClick={() => {
              queryClient.clear();
            }}
          >
            <Image
              priority={true}
              alt="SSD"
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
                        const cartUUID =
                          window.localStorage.getItem('cartUUID');
                        await axios.post(`/api/cart/${cartUUID}`, {
                          ...product,
                          amount: 1,
                        });
                        await queryClient.invalidateQueries({
                          queryKey: QueryAndMutationKeys.NavBarProducts,
                        });
                        toast('Added products to your cart succesfully');
                      } catch (e) {
                        console.error(e);
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
