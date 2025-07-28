import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { loginDetailsSchema } from '~/shared/zodSchemas';
import prisma from '~/prisma';
import { verifyPassword } from '~/backend/utils';
import { authLong } from '~/backend/auth/auth';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method', 405);
    }

    const loginDetailsParse = loginDetailsSchema.safeParse(req.body);

    if (loginDetailsParse.success === false) {
      const invalidField =
        loginDetailsParse.error.issues[0].path[0].toString() ||
        'Email or password';
      throw new HttpError(`${invalidField} is invalid!`, 400);
    }

    const loginDetails = loginDetailsParse.data;

    const userDetails = await prisma.user.findFirstOrThrow({
      where: {
        email: loginDetails.email,
      },
      select: {
        uuid: true,
        password: true,
      },
    });

    const isPasswordSame = await verifyPassword(
      loginDetails.password,
      userDetails.password,
    );

    if (!isPasswordSame) throw new HttpError('Password is invalid!', 400);

    const sessionUUID = await logUserIn(userDetails.uuid);

    // this detemines if session is long or short in user's Cookies
    res
      .appendHeader(
        'Set-cookie',
        authLong.createSessionCookie(sessionUUID).serialize(),
      )
      .status(200)
      .end();
  } catch (e) {
    return handleError(res, e);
  }
}

export async function logUserIn(userUUID: string) {
  // this determines if session is long or short in database
  const { uuid: sessionUUID } = await authLong.createSession(userUUID);

  return sessionUUID;
}
