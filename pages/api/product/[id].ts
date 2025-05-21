import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('ASD');
  if (req.method !== 'GET') {
    return res.status(405).send('GET request is the only allowed method');
  }
  const queryId = req.query.id;
  if (queryId === undefined || typeof queryId !== 'string') {
    return res.status(400).send('ID is mandatory in query');
  }
  const numberQueryId = Number(queryId);
  if (Number.isNaN(numberQueryId)) {
    return res.status(400).send('Invalid ID given');
  }

  const product = await prisma.product.findUnique({
    where: { id: numberQueryId },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(product);
}
