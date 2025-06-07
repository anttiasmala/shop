export function isUserLoggedIn(user: object): boolean {
  const verifyParameterObject =
    typeof user === 'object' && !Array.isArray(user) && user !== null;

  if (!verifyParameterObject) {
    return false;
  }

  if (Object.keys(user).length === 0) {
    return false;
  }

  return true;
}
