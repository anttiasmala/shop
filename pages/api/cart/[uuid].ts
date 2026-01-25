import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import prisma from '~/prisma';
import {
  createCartItemSchema,
  deleteCartItemSchema,
} from '~/shared/zodSchemas';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requestMethod = req.method;

    const queryUUID = req.query.uuid;
    if (queryUUID === undefined || typeof queryUUID !== 'string') {
      return res.status(400).send('UUID is mandatory in query');
    }

    if (requestMethod === 'GET') {
      return await handleGET(req, res, queryUUID);
    }

    if (requestMethod === 'POST') {
      return await handlePOST(req, res, queryUUID);
    }

    if (requestMethod === 'DELETE') {
      return await handleDELETE(req, res, queryUUID);
    }

    res.status(200).end();
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  cartUUID: string,
) {
  const cart = await prisma.cart.findFirstOrThrow({
    where: { userCartUUID: cartUUID },
  });

  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartUUID: cart.uuid,
    },
    select: {
      amount: true,
      createdAt: true,
      updatedAt: true,
      Product: {
        omit: {
          createdAt: true,
          updatedAt: true,
          uuid: true,
          stock: true,
        },
      },
    },
  });

  const clonedCartItems = structuredClone(cartItems);
  const newCartItems = clonedCartItems.map((clonedCartItem) => {
    return { ...clonedCartItem, whenRequestSent: new Date() };
  });

  return res.status(200).json(newCartItems);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  queryUUID: string,
) {
  const requestBodyParse = createCartItemSchema.safeParse(req.body);
  if (requestBodyParse.success === false) {
    throw new HttpError('Invalid req.body given', 400);
  }

  const productToBeAdded = requestBodyParse.data;
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productToBeAdded.id,
    },
  });
  const cart = await prisma.cart.findFirstOrThrow({
    where: {
      userCartUUID: queryUUID,
    },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cartUUID: cart.uuid,
      productUUID: product.uuid,
    },
  });

  // cartItem does not exist, create a new one
  if (!cartItem) {
    const amount =
      productToBeAdded.amount > product.stock
        ? product.stock
        : productToBeAdded.amount;
    const createdItem = await prisma.cartItem.create({
      data: {
        amount,
        cartUUID: cart.uuid,
        productUUID: product.uuid,
      },
    });
    return res.status(200).json(createdItem);
  }
  if (cartItem.amount + productToBeAdded.amount > product.stock) {
    throw new HttpError('Maximum amount of products reached!', 400);
  }

  const newAmount =
    cartItem.amount + productToBeAdded.amount >= product.stock
      ? product.stock
      : cartItem.amount + 1;

  const updatedItem = await prisma.cartItem.update({
    where: {
      cartUUID_productUUID: {
        cartUUID: cart.uuid,
        productUUID: product.uuid,
      },
    },
    data: {
      amount: newAmount,
    },
  });
  return res.status(200).json(updatedItem);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  queryUUID: string,
) {
  const deleteCartItemParse = deleteCartItemSchema.safeParse(req.body);

  if (!deleteCartItemParse.success) {
    throw new HttpError('Invalid request body', 400);
  }

  const requestBody = deleteCartItemParse.data;

  const cart = await prisma.cart.findFirstOrThrow({
    where: {
      userCartUUID: queryUUID,
    },
  });

  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: Number(requestBody.productId),
    },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      productUUID: product.uuid,
      cartUUID: cart.uuid,
    },
  });

  if (!cartItem) {
    return res.status(500).send('Product to be deleted does not exist');
  }

  await prisma.cartItem.delete({
    where: {
      uuid: cartItem.uuid,
      cartUUID: cart.uuid,
    },
  });

  res.status(200).end();
  return;
}
