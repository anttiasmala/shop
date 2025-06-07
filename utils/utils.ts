export function isUserLoggedIn(object: object): boolean {
  const verifyParameterObject =
    typeof object === 'object' && !Array.isArray(object) && object !== null;

  if (!verifyParameterObject) {
    return false;
  }

  if (Object.keys(object).length === 0) {
    return false;
  }

  return true;
}
