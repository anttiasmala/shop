import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-screen w-full bg-orange-300">
      <div className="flex justify-center">
        <Image
          priority={true}
          src={'/coffee_beans_and_coffee_cup.jpg'}
          alt="background"
          width={1920}
          height={1080}
          className="w-96 h-96"
        />
      </div>
      <div className="w-full flex justify-center mt-10">
        <Link
          href={'/shop'}
          className="border-1 text-white border-black rounded-lg text-4xl "
        >
          Maistuisiko kahvi?
        </Link>
      </div>
    </main>
  );
}
