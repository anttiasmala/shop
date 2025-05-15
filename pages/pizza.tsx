import Image from 'next/image';

export default function Pizza() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <TopBar />
      </div>
      <div className="flex w-[1300px] pl-40">
        <UnderTopBar />
      </div>
      <div className="flex pl-40">
        <FoodBlock />
        <FoodBlock />
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <div className="ml-40 flex h-20 w-full items-center bg-gray-100">
      <div className="flex w-max bg-green-700">
        <Image
          alt="logo"
          src={'/images/logo-white.png'}
          priority={false}
          width={128}
          height={40}
          className=""
        />
      </div>
      <div className="ml-4 text-xl font-bold text-green-700">MENU</div>
      <div className="ml-12 text-xl font-bold text-green-700">
        LUO OMA PIZZA
      </div>
      <div className="ml-12 text-xl font-bold text-green-700">KOTIJOUKOT</div>
      <div className="ml-65 text-xl font-bold text-green-700">Kirjaudu</div>
      <div className="ml-12 text-xl font-bold text-green-700">
        Tilaus 0,00 €
      </div>
    </div>
  );
}

function UnderTopBar() {
  return (
    <div className="flex w-full justify-evenly">
      <FoodTopBar titleText="Pizzat" />
      <FoodTopBar titleText="Luksuslankut" />
      <FoodTopBar titleText="Kotzonet" />
      <FoodTopBar titleText="Monsterit" />
      <FoodTopBar titleText="Huokeat herkut" />
      <FoodTopBar titleText="Rullat" />
      <FoodTopBar titleText="Dipit" />
      <FoodTopBar titleText="Juomat" />
      <FoodTopBar titleText="Jäätelöt" />
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
