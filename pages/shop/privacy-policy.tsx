import { InferGetServerSidePropsType } from 'next';
import { Footer } from '~/components/Footer';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// Does not require login
export { getServerSideProps };

export default function PrivacyPolicy({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main>
      <NavBar user={user} />
      <div className="flex w-full flex-col items-center">
        <p className="mt-4 text-4xl font-bold">Privacy Policy</p>
        <ul className="mt-4 mr-6 ml-6 list-decimal sm:mr-0 sm:ml-0">
          <li>This is a test privacy policy. We don&apos;t collect any data</li>
        </ul>
        <Footer />
      </div>
    </Main>
  );
}
