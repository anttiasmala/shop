export function NavBar() {
  return (
    <div className="flex h-16 w-full items-center justify-between bg-gray-100 shadow-lg">
      <p className="ml-1 text-lg font-bold md:ml-24 md:text-xl">MINIMONEY</p>
      <div className="absolute left-10 md:left-1/2">
        <p className="ml-28 font-bold md:text-xl">Home</p>
        <p className="ml-28 font-bold md:text-xl">Shop</p>
      </div>
    </div>
  );
}
