import { NextApiRequest, NextApiResponse } from 'next';
import { validateRequest } from '~/backend/auth/auth';
import { HttpError } from '~/backend/HttpError';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';
import prisma from '~/prisma';
import { patchProductSchema } from '~/shared/zodSchemas';

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

  if (req.method === 'PATCH') {
    return await handlePATCH(req, res);
  }

  res.status(405).send('GET, DELETE and PATCH are valid methods');
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
  // the reason why these aren't checked in Handler function is due to not needed in GET request
  // would make unnecessary traffic
  const isAdmin = checkIsAdminFromValidateRequest(
    await validateRequest(req, res),
  );

  // user is not Admin, throw an error
  if (!isAdmin) {
    throw new HttpError("You don't have privileges to do that", 400);
  }

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

async function handlePATCH(req: NextApiRequest, res: NextApiResponse) {
  // the reason why these aren't checked in Handler function is due to not needed in GET request
  // would make unnecessary traffic
  const isAdmin = checkIsAdminFromValidateRequest(
    await validateRequest(req, res),
  );

  // user is not Admin, throw an error
  if (!isAdmin) {
    throw new HttpError("You don't have privileges to do that", 400);
  }

  const queryId = req.query.id;
  if (queryId === undefined || typeof queryId !== 'string') {
    return res.status(400).send('ID is mandatory in query');
  }

  const numberQueryId = Number(queryId);
  if (Number.isNaN(numberQueryId)) {
    return res.status(400).send('Invalid ID given');
  }

  const productSchemaParse = patchProductSchema.safeParse(req.body);

  if (productSchemaParse.success === false) {
    return res.status(400).send('Invalid request body given');
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: numberQueryId,
    },
    data: productSchemaParse.data,
  });

  return res.status(200).json(updatedProduct);
}
