import { NextApiRequest, NextApiResponse } from 'next';
import { TimeSpan } from '~/backend/auth/auth/date';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import prisma from '~/prisma';
import { createCartSchema, patchCartItemSchema } from '~/shared/zodSchemas';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requestMethod = req.method;
    if (requestMethod === 'GET') {
      return await handleGET(req, res);
    }

    if (requestMethod === 'POST') {
      return await handlePOST(req, res);
    }

    if (requestMethod === 'PATCH') {
      return await handlePATCH(req, res);
    }
    res.status(200).end();
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const cart = await prisma.cart.findFirstOrThrow({ where: { id: 1 } });

  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartUUID: cart.uuid,
    },
    select: {
      amount: true,
      Product: {
        omit: {
          createdAt: true,
          updatedAt: true,
          uuid: true,
        },
      },
    },
  });

  return res.status(200).json(cartItems);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const parsedCreateCartSchema = createCartSchema.safeParse(req.body);
  if (parsedCreateCartSchema.success === false) {
    throw new HttpError('Invalid request body', 400);
  }
  const reqBodyData = parsedCreateCartSchema.data;
  console.log(reqBodyData);

  const timeSpan = new TimeSpan(30, 'd');

  await prisma.cart.create({
    data: {
      userCartUUID: reqBodyData.cartUUID,
      expiresAt: new Date(Date.now() + timeSpan.milliseconds()),
    },
  });

  res.status(200).end();
}

async function handlePATCH(req: NextApiRequest, res: NextApiResponse) {
  const requestBodyParse = patchCartItemSchema.safeParse(req.body);

  if (requestBodyParse.success === false) {
    throw new HttpError('Invalid request body', 400);
  }
  const cartItem = requestBodyParse.data;

  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: cartItem.id,
    },
  });

  const cartFromDatabase = await prisma.cart.findFirstOrThrow({
    where: {
      userCartUUID: cartItem.userCartUUID,
    },
  });

  const cartItemFromDatabase = await prisma.cartItem.findFirstOrThrow({
    where: {
      productUUID: product.uuid,
      cartUUID: cartFromDatabase.uuid,
    },
  });

  if (cartItem.amount <= 0) {
    await prisma.cartItem.delete({
      where: {
        uuid: cartItemFromDatabase.uuid,
        productUUID: product.uuid,
      },
    });
    res.status(200).end();
    return;
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: {
      uuid: cartItemFromDatabase.uuid,
    },
    data: {
      amount: cartItem.amount,
    },
  });

  return res.status(200).json(updatedCartItem);
}
