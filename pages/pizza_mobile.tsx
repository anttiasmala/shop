import Image from 'next/image';

export default function Pizza() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <TopBar />
      </div>
      <div className="flex">
        <UnderTopBar />
      </div>
      <div className="flex pl-40"></div>
    </main>
  );
}

function TopBar() {
  return (
    <div className="flex h-20 w-full items-center bg-gray-100">
      <div className="flex h-full w-max items-center bg-green-600">
        <Image
          alt="logo"
          src={'/images/logo-white.png'}
          priority={false}
          width={60}
          height={40}
          className="h-10 w-16"
        />
      </div>
    </div>
  );
}

function UnderTopBar() {
  return (
    <div className="flex flex-wrap">
      <div className="ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Pizzat </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="ml-3 flex h-20 w-40 items-center justify-between overflow-hidden bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Luksuslankut </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Kotzonet </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Monsterit</p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Huokeat herkut </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Rullat </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Dipit </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Juomat </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
      <div className="mt-3 ml-3 flex h-20 w-40 items-center justify-between bg-gray-200">
        <p className="ml-3 text-xl text-green-600">Jäätelöt </p>
        <Image alt="pizza" src={'/images/rullat.png'} width={64} height={64} />
      </div>
    </div>
  );
}

function FoodTopBar({ titleText }: { titleText: string }) {
  return (
    <button className="group flex flex-col items-center">
      <Image alt="rullat" src={'/images/rullat.png'} width={60} height={60} />
      <p className="group-hover:underline">{titleText}</p>
    </button>
  );
}

function FoodBlock() {
  return (
    <div className="flex h-96 w-64 flex-col rounded border">
      <Image
        alt="pizzaBase"
        src={'/images/pizza-thaikana-20250325-540x380.jpg'}
        width={540}
        height={380}
      />
      <div className="flex justify-between">
        <div className="m-5 text-lg font-bold text-green-700">Thaikana</div>
        <div className="m-5 w-20 rounded-2xl bg-green-700 text-center text-lg font-bold text-white">
          16.90€
        </div>
      </div>
      <p className="m-4 mt-0 text-sm">
        green curry -kastike (sis. kalaa), Kotipizza-juusto 1/2 annos,
        grillimaustettu kananpoika x 2, green curry -kastike (sis. kalaa),
        salaattisekoitus, korianteri, punainen chili
      </p>
    </div>
  );
}
