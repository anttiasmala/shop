import Link from 'next/link';

export default function Index() {
  return (
    <main className="h-screen w-full">
      <div className="flex h-screen w-full justify-center bg-[url(/background2.png)] bg-size-[100%_100%] bg-no-repeat">
        <div className="flex h-full w-full items-start justify-center">
          <div className="mt-12">
            <Link
              href={'/shop'}
              className="button-54 block w-80 bg-blue-400/80 text-center"
            >
              Shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
