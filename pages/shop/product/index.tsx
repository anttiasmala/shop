import { InferGetServerSidePropsType } from 'next/dist/types';
import Link from 'next/link';
import { Footer } from '~/components/Footer';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// No login required
export { getServerSideProps };

export default function HandleProduct({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main>
      <NavBar user={user} />
      <div className="flex w-full justify-center">
        <Link
          href={'/shop'}
          className="rounded-md border-4 border-black p-4 text-5xl font-bold"
        >
          Whoops! Nothing found!
        </Link>
      </div>
      <Footer />
    </Main>
  );
}
