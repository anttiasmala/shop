import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { auth, validateRequest } from '~/backend/auth/auth';
import { GetUser, User } from '~/shared/types';
import { getUserSchema } from '~/shared/zodSchemas';

/**
 * **>>IMPORTANT<<**
 *
 * This function is ran in backend!
 *
 * **>>IMPORTANT<<**
 */

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: GetUser }>> {
  const cookieData = await validateRequest(context.req, context.res);
  if (
    !cookieData.user ||
    !cookieData.session ||
    !cookieData.session.isLoggedIn
  ) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }
  const returnThis = getUserSchema.safeParse(cookieData.user);
  if (returnThis.error) {
    await auth.deleteSession(cookieData.session.uuid);

    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  return {
    props: {
      // getStaticProps can only return plain objects (i.e., objects with
      // primitive values). This is why we use JSON.parse and JSON.stringify
      // to convert the object to a plain object (specifically here we convert
      // the user.createdAt Date object to a string).
      user: JSON.parse(JSON.stringify(returnThis.data)) as GetUser,
    },
  };
}

/**
 * **>>IMPORTANT<<**
 *
 * This function is ran in backend!
 *
 * **>>IMPORTANT<<**
 */

export async function getServerSidePropsAdminOnly(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User }>> {
  const cookieData = await validateRequest(context.req, context.res);

  if (
    !cookieData.user ||
    !cookieData.session ||
    !cookieData.session.isLoggedIn ||
    cookieData.user.role !== 'ADMIN'
  ) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }
  const returnThis = getUserSchema.safeParse(cookieData.user);
  if (returnThis.error) {
    await auth.deleteSession(cookieData.session.uuid);

    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  return {
    props: {
      // getStaticProps can only return plain objects (i.e., objects with
      // primitive values). This is why we use JSON.parse and JSON.stringify
      // to convert the object to a plain object (specifically here we convert
      // the user.createdAt Date object to a string).
      user: JSON.parse(JSON.stringify(returnThis.data)) as User,
    },
  };
}
