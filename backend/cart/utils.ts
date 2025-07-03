import prisma from '~/prisma';
import { TimeSpan } from '../auth/auth/date';
/**
 * Links User's UUID and cart's userUUID field together
 */
export async function linkUserToCart(cartUUID: string, userUUID: string) {
  void cartUtilFunctions.deleteExpiredCarts().catch((e) => console.error(e));

  await prisma.cart.update({
    where: {
      userCartUUID: cartUUID,
    },
    data: {
      userUUID: userUUID,
    },
  });
}

export async function unLinkUserAndCart(cartUUID: string, userUUID: string) {
  void cartUtilFunctions.deleteExpiredCarts().catch((e) => console.error(e));

  await prisma.cart.update({
    where: {
      userCartUUID: cartUUID,
      userUUID: userUUID,
    },
    data: {
      userUUID: null,
    },
  });
}

export const cartUtilFunctions = {
  async updateExpirationDate(userCartUUID: string) {
    const timeSpan = new TimeSpan(30, 'd');
    await prisma.cart.update({
      where: {
        userCartUUID,
      },
      data: {
        expiresAt: new Date(Date.now() + timeSpan.milliseconds()),
      },
    });
  },

  async deleteExpiredCarts() {
    await prisma.cart.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  },
};
