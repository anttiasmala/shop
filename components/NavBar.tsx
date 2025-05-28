import Link from 'next/link';
import { HTMLAttributes, useEffect, useState } from 'react';
import SvgMenu from '~/icons/menu';
import SvgStoreBag from '~/icons/store_bag';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GetCart, QueryAndMutationKeys } from '~/shared/types';

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productAmount, setProductAmount] = useState(0);

  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.NavBarProducts,
    queryFn: async () => {
      return (await axios.get('/api/cart')).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    function runThis() {
      let amountOfItems = 0;
      for (const item of products || []) {
        if (item.amount) {
          amountOfItems += item.amount;
        }
      }
      setProductAmount(amountOfItems);
    }
    runThis();
  }, [products]);

  return (
    <div>
      <div className="flex h-16 w-full items-center justify-between bg-white shadow-lg">
        <Link
          href={'/shop'}
          className="ml-4 text-lg font-bold sm:ml-[15%] sm:text-xl"
        >
          MINIMONEY
        </Link>
        <div className="mr-3 flex sm:absolute sm:left-1/2">
          <button onClick={() => setIsMenuOpen((prevValue) => !prevValue)}>
            {isMenuOpen ? (
              <span className="text-3xl font-bold">X</span>
            ) : (
              <SvgMenu className="sm:hidden" width={30} height={30} />
            )}
          </button>
          <LinkElement
            href={'/shop'}
            className="mr-8 hidden hover:text-gray-600 sm:inline"
          >
            Home
          </LinkElement>
          <LinkElement href={'/shop/products'} className="hidden sm:inline">
            Shop
          </LinkElement>
        </div>
        <Link href={'/shop/cart'} className="relative mr-10 sm:mr-0">
          <span className="absolute top-1 left-0 flex rounded-full bg-red-500 p-1 pt-0 pb-0 text-xs text-white">
            <p>{productAmount}</p>
          </span>
          <SvgStoreBag width={40} height={40} className="" />
        </Link>
      </div>
      <Menu isMenuOpen={isMenuOpen} />
    </div>
  );
}

function Menu({ isMenuOpen }: { isMenuOpen: boolean }) {
  if (!isMenuOpen) return null;
  return (
    <div className="h-24 w-full shadow-lg">
      <div className="w-full">
        <LinkElement href={'/shop'} className="block p-3">
          Home
        </LinkElement>
        <LinkElement href={'/shop/products'} className="block p-3 pt-0">
          Shop
        </LinkElement>
      </div>
    </div>
  );
}

function LinkElement({
  href,
  className,
  children,
}: { href: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <Link className={twMerge('hover:text-gray-600', className)} href={href}>
      {children}
    </Link>
  );
}
