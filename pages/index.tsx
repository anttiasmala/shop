import Image from 'next/image';

export default function Home() {
  return (
    <main className="h-screen w-full bg-gray-500">
      <div className="flex justify-center">
        <Image
          src={'/logo.jpg'}
          alt="background"
          width={1920}
          height={1080}
          className=""
        />
      </div>
      <div className="w-full flex justify-center mt-10">
        <button className="border-1 text-white border-black rounded-lg text-4xl ">
          Maistuisiko kahvi?
        </button>
      </div>
    </main>
  );
}
