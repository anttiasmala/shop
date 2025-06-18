import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-10 h-8 w-full">
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-600">
          © MINIMONEY Shop. All rights reserverd.
        </p>
        <div className="m-2 flex text-sm">
          <Link href={'/privacy-policy'} className="mr-8 hover:text-black/50">
            Privacy Policy
          </Link>
          <Link
            href={'/terms-of-service'}
            className="inline hover:text-black/50"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
