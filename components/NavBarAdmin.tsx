import Link from 'next/link';
import { HTMLAttributes, useState } from 'react';
import SvgMenu from '~/icons/menu';
import { twMerge } from 'tailwind-merge';

export function NavBarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="flex h-16 w-full items-center justify-between bg-white shadow-lg">
        <Link
          href={'/'}
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
            href={'/admin'}
            className="hidden hover:text-gray-600 sm:inline"
          >
            Home Admin Page
          </LinkElement>
        </div>
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
        <LinkElement href={'/'} className="block p-3">
          Home
        </LinkElement>
        <LinkElement href={'/products'} className="block p-3 pt-0">
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
