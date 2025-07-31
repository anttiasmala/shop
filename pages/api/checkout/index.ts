import { NextApiRequest, NextApiResponse } from 'next';
import { HttpError } from '~/backend/HttpError';
import {
  cartProductsCheckoutSchema,
  fullCheckoutSchema,
} from '~/shared/zodSchemas';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { validateRequest } from '~/backend/auth/auth';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const purchaseDetailsParse = fullCheckoutSchema.safeParse(
      req.body.purchaseDetails,
    );
    const cartItemsParse = cartProductsCheckoutSchema.safeParse(
      req.body.cartItems,
    );

    if (!purchaseDetailsParse.success) {
      throw new HttpError('Invalid request body', 400);
    }
    if (!cartItemsParse.success) {
      throw new HttpError('Invalid request body', 400);
    }

    const { user } = await validateRequest(req, res);

    console.log(cartItemsParse.data);

    let totalAmount = 0;

    for (const [_, value] of Object.entries(cartItemsParse.data)) {
      totalAmount += value.amount * Number(value.Product.price);
    }

    // 'PENDING', 'COMPLETED', 'CANCELED', 'SHIPPED'.
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        totalAmount: totalAmount,
        userUUID: `${user?.uuid ? user.uuid : ''}`,
      },
    });

    for (const [_, value] of Object.entries(cartItemsParse.data)) {
      const product = await prisma.product.findFirst({
        where: {
          id: value.Product.id,
        },
      });

      if (!product) {
        return;
      }

      await prisma.orderItem.create({
        data: {
          priceAtPurchase: Number(value.Product.price),
          quantity: value.amount,
          productUUID: product.uuid,
          orderUUID: order.uuid,
        },
      });
    }
  } catch (e) {
    handleError(res, e);
  }

  res.status(200).end();
}
