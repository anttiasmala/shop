import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { NavBarAdmin } from '~/components/NavBarAdmin';

export default function AdminIndex() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <div className="w-full sm:max-w-1/2">
          <NavBarAdmin />
          <p className="mt-3 animate-[opacity_1200ms] text-center text-4xl font-bold">
            Admin Dashboard
          </p>
          <div className="mt-5 flex w-full">
            <LinkElement
              href={'/shop/admin/products'}
              title="Edit Products"
              titleDescription="Edit, add and delete current products"
            />
            <LinkElement
              href={'/shop/admin/upload-images'}
              title="Upload Product Images"
              titleDescription="Add image of a product"
            />
            <LinkElement
              href={'/shop/admin/list-images'}
              title="List Images"
              titleDescription="See, edit and delete product images"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function LinkElement({
  href,
  className,
  title,
  titleDescription,
  children,
}: {
  href: string;
  title: string;
  titleDescription: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Link
      href={href}
      className={twMerge(
        'mr-8 h-32 w-64 rounded bg-gray-200 text-center hover:bg-gray-300',
        className,
      )}
    >
      <p className="relative text-lg font-bold">{title}</p>
      <p className="mt-4 text-xs sm:mt-8">{titleDescription}</p>
    </Link>
  );
}
