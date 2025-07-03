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
          <li>
            This is a test privacy policy. When website is visited, a unique
            anonymous UUID is created that is stored in server&apos;s database.
            If user registers, first name, last name, email and password
            (crypted) is stored into server&apos;s database. The cart&apos;s
            UUID is linked with the user&apos;s data when registered / logged in
          </li>
        </ul>
        <Footer />
      </div>
    </Main>
  );
}
