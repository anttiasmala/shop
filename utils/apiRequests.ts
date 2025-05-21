import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function getProducts() {
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return (await axios.get(`/api/product}`)).data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
}
