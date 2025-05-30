import Link from 'next/link';

export default function AdminIndex() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <div className="w-full sm:max-w-1/2">
          <p className="animate-[opacity_1200ms] text-center">Admin panel</p>
          <div className="mt-5 flex w-full flex-col items-center">
            <Link href={'/shop/admin/products'} className="bg-gray-200">
              Edit Products
            </Link>
            <Link
              href={'/shop/admin/upload-images'}
              className="mt-4 bg-gray-200"
            >
              Upload Product Images
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
