import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { Main } from '~/components/Main';
import { NavBarAdmin } from '~/components/NavBarAdmin';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';

export { getServerSideProps };

export default function AdminIndex({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return (
    <Main>
      <NavBarAdmin />
      <p className="mt-3 animate-[opacity_1200ms] text-center text-4xl font-bold">
        Admin Dashboard
      </p>
      <div className="mt-5 grid w-96 grid-cols-3 sm:w-full">
        <LinkElement
          href={'/admin/products'}
          title="Edit Products"
          titleDescription="Edit, add and delete current products"
        />
        <LinkElement
          href={'/admin/upload-images'}
          title="Upload Product Images"
          titleDescription="Add image of a product"
        />
        <LinkElement
          href={'/admin/list-images'}
          title="List Images"
          titleDescription="See, edit and delete product images"
        />
      </div>
    </Main>
  );
}

function LinkElement({
  href,
  className,
  title,
  titleDescription,
}: {
  href: string;
  title: string;
  titleDescription: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Link
      href={href}
      className={twMerge(
        'm-1 h-auto min-h-32 w-auto rounded bg-gray-200 text-center hover:bg-gray-300',
        className,
      )}
    >
      <p className="relative text-lg font-bold">{title}</p>
      <p className="mt-4 text-xs sm:mt-8">{titleDescription}</p>
    </Link>
  );
}
