import { InferGetServerSidePropsType } from 'next';
import { Main } from '~/components/Main';
import { NavBar } from '~/components/NavBar';
import { GetUser } from '~/shared/types';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';

// Does not require login
export { getServerSideProps };

export default function Checkout({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main>
      <NavBar user={{} as GetUser} />
    </Main>
  );
}
