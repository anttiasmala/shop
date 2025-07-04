import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PatchCartItem, Product, QueryAndMutationKeys } from '~/shared/types';

export function useGetProducts() {
  return useQuery({
    queryKey: QueryAndMutationKeys.Products,
    queryFn: async () => {
      return (await axios.get(`/api/admin/products`)).data as Product[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: [QueryAndMutationKeys.Product, id],
    queryFn: async () => {
      return (await axios.get(`/api/admin/products/${id}`)).data as Product;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
}

export function useChangeProductAmount(productId: number, newAmount: number) {
  const data: PatchCartItem = {
    id: productId,
    amount: newAmount,
  };
  return useMutation({
    mutationKey: QueryAndMutationKeys.ReduceProductAmount,
    mutationFn: async () => {
      return (await axios.patch(`/api/cart/`, data)).data as Product;
    },
  });
}
