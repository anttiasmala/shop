import { ArrowRight, Edit, Image, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { NavBar } from '~/components/NavBar';
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
            <Link
              href={'/shop/admin/products'}
              className="mr-8 h-32 w-64 rounded bg-gray-200 text-center hover:bg-gray-300"
            >
              <p className="flex justify-center text-lg font-bold">
                Edit Products
                <span className="sm:ml-2">
                  <Edit />
                </span>
              </p>
              <p className="mt-4 text-xs sm:mt-8">
                Edit, add and delete current products
              </p>
            </Link>
            <Link
              href={'/shop/admin/upload-images'}
              className="mr-8 h-32 w-64 rounded bg-gray-200 text-center hover:bg-gray-300"
            >
              <p className="relative text-lg font-bold">
                <span className="absolute right-0">
                  <Image />
                </span>
                Upload Product Images
              </p>
              <p className="mt-4 text-xs sm:mt-8">Add image of a product</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
