import type { IncomingMessage, ServerResponse } from 'http';
import { TimeSpan } from './auth/index';
import prisma from '~/prisma';
import type { User, FrontendSession, GetUser } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpError } from '~/backend/HttpError';
import { AuthAdapter } from './db-adapter';
import { Auth } from './auth/index';

const prismaAdapter = new AuthAdapter(prisma);

/** 1 hour */
export const auth = new Auth(prismaAdapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

/** 30 days | 1 month */
export const authLong = new Auth(prismaAdapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<
  { user: GetUser; session: FrontendSession } | { user: null; session: null }
> {
  const sessionUUID = authLong.readSessionCookie(req.headers.cookie ?? '');
  if (!sessionUUID) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await authLong.validateSession(sessionUUID);
  if (result.session && result.session.fresh) {
    res.appendHeader(
      'Set-Cookie',
      authLong.createSessionCookie(result.session.uuid).serialize(),
    );
  }
  if (!result.session) {
    res.appendHeader(
      'Set-Cookie',
      authLong.createBlankSessionCookie().serialize(),
    );
  }

  return result;
}

export async function requireLogin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ user: GetUser; session: FrontendSession }> {
  const userDetails = await validateRequest(req, res);
  if (
    !userDetails.session ||
    !userDetails.user ||
    !userDetails.session.isLoggedIn
  ) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userDetails;
}

/**
 * Checks for a valid user and session, **REGARDLESS** of login status
 *
 * **ATTENTION**: the user **DOES NOT** need to be logged in for this function to validate request
 */

export async function checkIfSessionValid(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ user: User; session: FrontendSession }> {
  const userData = await validateRequest(req, res);
  if (!userData.session || !userData.user) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userData;
}
