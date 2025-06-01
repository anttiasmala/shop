import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';

export default function PrivacyPolicy() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <div className="w-full sm:max-w-1/2">
          <NavBar />
          <div className="flex w-full flex-col items-center">
            <p className="mt-4 text-4xl font-bold">Terms of Service</p>
            <ul className="mt-4 mr-6 ml-6 list-decimal sm:mr-0 sm:ml-0">
              <li>This is a test Terms Of Service text.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
