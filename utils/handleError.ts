import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const POSSIBLE_ERRORS = {
  'unexpected token': 'JSON format is invalid',
  'is not valid json': 'JSON format is invalid',
  'user was not found on the server!': 'Email is not registered',
  'password is invalid!': 'Password is invalid!',
  'email was not unique!': 'Email was not unique',
  'product was not found on the server!':
    'Product was not found on the server!',
} as const;

type KnownErrorTexts = keyof typeof POSSIBLE_ERRORS;

export function handleError(e: unknown) {
  if (e instanceof Error === false) {
    console.error(e);
    toast('Unknown error');
    return 'Unknown error';
  }

  if (e instanceof AxiosError) {
    const errorText =
      e.response?.data && typeof e.response.data === 'string'
        ? POSSIBLE_ERRORS[e.response.data.toLowerCase() as KnownErrorTexts]
        : null;

    console.error('AxiosError happened', e.response?.data);
    toast(errorText || 'In sent request happened an error');
    return errorText || 'In sent request happened an error';
  }

  for (const [key, value] of Object.entries(POSSIBLE_ERRORS)) {
    if (e.message.toLowerCase().includes(key)) {
      console.error(e);
      toast(value);
      console.error(value);
      return value;
    }
  }

  const knownErrorText =
    POSSIBLE_ERRORS[e.message.toLowerCase() as KnownErrorTexts];

  if (knownErrorText) {
    console.error(e);
    toast(knownErrorText);
    return knownErrorText;
  }

  console.error(e);
  toast('Server error');
  return 'Server error';
}
