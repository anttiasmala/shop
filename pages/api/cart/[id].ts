import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requestMethod = req.method;

    if (requestMethod === 'DELETE') {
      return await handleDELETE(req, res);
    }

    res.status(200).end();
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const queryId = req.query.id;
  if (queryId === undefined || typeof queryId !== 'string') {
    return res.status(400).send('ID is mandatory in query');
  }
  const numberQueryId = Number(queryId);
  if (Number.isNaN(numberQueryId)) {
    return res.status(400).send('Invalid ID given');
  }

  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: numberQueryId,
    },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      productUUID: product.uuid,
    },
  });

  if (!cartItem) {
    return res.status(500).send('Server Error');
  }

  await prisma.cartItem.delete({
    where: {
      uuid: cartItem.uuid,
    },
  });

  res.status(200).end();
  return;
}
