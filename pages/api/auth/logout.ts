import { NextApiRequest, NextApiResponse } from 'next';
import { auth, validateRequest } from '~/backend/auth/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import prisma from '~/prisma';
import { getServerSideProps } from '~/utils/getServerSideProps';

export { getServerSideProps };

export default async function Logout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    // check if request is validated
    const { session } = await validateRequest(req, res);
    if (!session) {
      res.status(200).end();
      return;
    }
    // if session is found, mark user's isLoggedIn to false it
    await auth.deleteSession(session.uuid);

    res
      .appendHeader('Set-cookie', auth.createBlankSessionCookie().serialize())
      .status(200)
      .end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}
