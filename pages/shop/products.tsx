import { Container } from '~/components/Container';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';

export default function Products() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      <div>
        <p className="m-6 text-3xl font-bold">All Products</p>
      </div>
      <Footer />
    </main>
  );
}
