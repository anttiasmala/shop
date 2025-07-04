import { NextApiRequest, NextApiResponse } from 'next';
import { validateRequest } from '~/backend/auth/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';
import prisma from '~/prisma';
import { createProductSchema } from '~/shared/zodSchemas';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'GET') {
      return await handleGET(req, res);
    }

    if (req.method === 'POST') {
      return await handlePOST(req, res);
    }

    res.status(405).send('GET and POST requests are only allowed');
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

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = checkIsAdminFromValidateRequest(
    await validateRequest(req, res),
  );
  // user is not Admin, throw an error
  if (!isAdmin) {
    throw new HttpError("You don't have privileges to do that", 400);
  }
  const productSchemaParse = createProductSchema.safeParse(req.body);

  if (productSchemaParse.success === false) {
    return res.status(200).send('Wrong request body given');
  }

  const createdProduct = await prisma.product.create({
    data: productSchemaParse.data,
  });

  return res.status(200).json(createdProduct);
}
