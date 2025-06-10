import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const POSSIBLE_ERRORS = {
  'unexpected token': 'JSON-muoto on virheellinen',
  'is not valid json': 'JSON-muoto on virheellinen',
  'user was not found on the server!': 'Käyttäjää ei ole rekistöröity',
} as const;

type KnownErrorTexts = keyof typeof POSSIBLE_ERRORS;

export function handleError(e: unknown) {
  if (e instanceof Error === false) {
    console.error(e);
    toast('Tuntematon virhe');
    return 'Tuntematon virhe';
  }

  if (e instanceof AxiosError) {
    const errorText =
      e.response?.data && typeof e.response.data === 'string'
        ? POSSIBLE_ERRORS[e.response.data.toLowerCase() as KnownErrorTexts]
        : null;

    console.error('AxiosError happened', e.response?.data);
    toast(errorText || 'Lähetetyssä pyynnössä palvelimelle tapahtui virhe ');
    return errorText || 'Lähetetyssä pyynnössä palvelimelle tapahtui virhe ';
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
  toast('Palvelinvirhe');
  return 'Palvelinvirhe';
}
