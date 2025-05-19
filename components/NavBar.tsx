import Link from 'next/link';
import { AnchorHTMLAttributes, HTMLAttributes, useState } from 'react';
import { useIsPhoneUser } from '~/hooks/useIsPhoneUser';
import SvgMenu from '~/icons/menu';
import SvgStoreBag from '~/icons/store_bag';
import { twMerge } from 'tailwind-merge';

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isPhoneUser = useIsPhoneUser();

  return (
    <div>
      <div className="flex h-16 w-full items-center justify-between bg-gray-100 shadow-lg">
        <p className="ml-1 text-lg font-bold sm:ml-24 sm:text-xl">MINIMONEY</p>
        <div className="mr-3 flex sm:left-1/2">
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
          <LinkElement href={'/shop/shop'} className="hidden sm:inline">
            Shop
          </LinkElement>
        </div>
        <SvgStoreBag width={40} height={40} className="mr-10 sm:mr-25" />
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
        <LinkElement href={'/shop/shop'} className="block p-3 pt-0">
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
