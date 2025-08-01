import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'GET') {
      return await handleGET(req, res);
    }

    res.status(405).send('GET request is only allowed');
    return;
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const products = await prisma.product.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(products);
}
