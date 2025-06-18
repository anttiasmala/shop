import { compare as bcryptCompare, hash } from 'bcrypt';
import { FrontendSession, GetUser } from '~/shared/types';

export async function verifyPassword(
  givenPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcryptCompare(givenPassword, hashedPassword);
  return isMatch;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Checks if user gotten from validateRequest is admin
 * @returns boolean
 */
export function checkIsAdminFromValidateRequest(
  validatedRequest:
    | { user: GetUser; session: FrontendSession }
    | { user: null; session: null },
): boolean {
  if (
    !validatedRequest.session ||
    !validatedRequest.user ||
    validatedRequest.user.role !== 'ADMIN'
  ) {
    return false;
  }
  return true;
}
