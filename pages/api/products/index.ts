import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('GET request is the only allowed method');
    }

    const products = await prisma.product.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(products);
    return;
  } catch (e) {
    return handleError(res, e);
  }
}
