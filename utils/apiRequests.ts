import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product, QueryAndMutationKeys } from '~/shared/types';

export function useGetProducts() {
  return useQuery({
    queryKey: QueryAndMutationKeys.Products,
    queryFn: async () => {
      return (await axios.get(`/api/products`)).data as Product[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: QueryAndMutationKeys.Product,
    queryFn: async () => {
      return (await axios.get(`/api/products/${id}`)).data as Product;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
}
