import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import prisma from '~/prisma';
import { createCartItemSchema } from '~/shared/zodSchemas';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requestMethod = req.method;
    console.log(requestMethod);
    if (requestMethod === 'GET') {
      return await handleGET(req, res);
    }

    if (requestMethod === 'POST') {
      return await handlePOST(req, res);
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
  console.log(req.body);
  const requestBodyParse = createCartItemSchema.safeParse(req.body);
  if (requestBodyParse.success === false) {
    throw new HttpError('Invalid req.body given', 400);
  }
  const productToBeAdded = requestBodyParse.data;
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: requestBodyParse.data.id,
    },
  });
  const cart = await prisma.cart.findFirstOrThrow({
    where: {
      id: 1,
    },
  });

  const productExists = await prisma.cartItem.findFirst({
    where: {
      productUUID: product.uuid,
    },
  });

  if (productExists) {
    const updatedItem = await updateExistingCartItem(
      productExists.id,
      productExists.amount,
      productToBeAdded.amount,
    );

    return res.status(200).json(updatedItem);
  }

  const createdItem = await prisma.cartItem.create({
    data: {
      cartUUID: cart.uuid,
      productUUID: product.uuid,
      amount: productToBeAdded.amount,
    },
  });
  return res.status(200).json(createdItem);
}

async function updateExistingCartItem(
  id: number,
  amountBeforeUpdate: number,
  amountToBeAdded: number,
) {
  await prisma.cartItem.update({
    where: {
      id,
    },
    data: {
      amount: amountBeforeUpdate + amountToBeAdded,
    },
  });
}
