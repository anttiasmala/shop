import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return await handleGET(req, res);
  }

  if (req.method === 'DELETE') {
    return await handleDELETE(req, res);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
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

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const queryId = req.query.id;
  if (queryId === undefined || typeof queryId !== 'string') {
    return res.status(400).send('ID is mandatory in query');
  }

  const numberQueryId = Number(queryId);
  if (Number.isNaN(numberQueryId)) {
    return res.status(400).send('Invalid ID given');
  }

  await prisma.product.delete({
    where: { id: numberQueryId },
  });

  res.status(200).end();
  return;
}
