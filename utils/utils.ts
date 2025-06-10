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

export function JSONParse(value: string) {
  try {
    if (typeof value !== 'string') {
      throw new Error('Was not a string');
    }

    const parsedValue = JSON.parse(value) as object;
    return parsedValue;
  } catch (e) {
    console.error(e);
    throw new Error('Value is not parseable');
  }
}
