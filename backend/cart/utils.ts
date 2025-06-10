import prisma from '~/prisma';
/**
 * Links User's UUID and cart's userUUID field together
 */
export async function linkUserToCart(cartUUID: string, userUUID: string) {
  await prisma.cart.update({
    where: {
      userCartUUID: cartUUID,
    },
    data: {
      userUUID: userUUID,
    },
  });
}
