import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PatchCartItem, Product, QueryAndMutationKeys } from '~/shared/types';

export function useGetProducts() {
  return useQuery({
    queryKey: QueryAndMutationKeys.Products,
    queryFn: async () => {
      // this does not require Admin rights
      return (await axios.get(`/api/products`)).data as Product[];
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
      return (await axios.get(`/api/products/${id}`)).data as Product;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
}

export function useChangeProductAmount({
  productId,
  newAmount,
  userCartUUID,
}: {
  productId: number;
  newAmount: number;
  userCartUUID: string;
}) {
  const data: PatchCartItem = {
    id: productId,
    amount: newAmount,
    userCartUUID: userCartUUID,
  };
  return useMutation({
    mutationKey: QueryAndMutationKeys.ReduceProductAmount,
    mutationFn: async () => {
      return (await axios.patch(`/api/cart/`, data)).data as Product;
    },
  });
}

export async function refetchCartProducts(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: QueryAndMutationKeys.CartProducts,
  });
}
