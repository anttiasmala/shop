import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function handleError(e: unknown) {
  if (e instanceof Error === false) {
    console.error(e);
    toast('Tuntematon virhe');
    return 'Tuntematon virhe';
  }

  if (e instanceof AxiosError) {
    console.error('AxiosError happened', e.response?.data);
    toast('Lähetetyssä pyynnössä palvelimelle tapahtui virhe ');
    return 'Lähetetyssä pyynnössä palvelimelle tapahtui virhe ';
  }

  console.error(e);
  toast('Palvelinvirhe');
  return 'Palvelinvirhe';
}
