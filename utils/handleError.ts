import { AxiosError } from 'axios';

export function handleError(e: unknown) {
  if (e instanceof Error === false) {
    console.error(e);
    return 'Tuntematon Virhe';
  }

  if (e instanceof AxiosError) {
    console.error('AxiosError happened', e.response?.data);
    return 'Axios Error';
  }

  return 'Palvelinvirhe';
}
