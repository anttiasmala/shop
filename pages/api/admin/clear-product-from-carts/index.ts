import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { validateRequest } from '~/backend/auth/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';
import prisma from '~/prisma';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method', 405);
    }
    const isAdmin = checkIsAdminFromValidateRequest(
      await validateRequest(req, res),
    );

    if (!isAdmin) {
      throw new HttpError("You don't have privileges to do that", 400);
    }

    const reqBodySchema = z.object({
      productId: z.number().min(1),
    });

    const reqBodyParse = reqBodySchema.safeParse(req.body);

    if (!reqBodyParse.success) {
      throw new HttpError('Invalid request body', 400);
    }

    const { productId } = reqBodyParse.data;

    void deleteProductFromCarts(productId);

    res.status(200).end();
  } catch (e) {
    handleError(res, e);
  }
}

async function deleteProductFromCarts(productId: number) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new HttpError(
      'Deletion failed. Product was not found on the server',
      400,
    );
  }

  await prisma.cartItem.deleteMany({
    where: {
      productUUID: product.uuid,
    },
  });
}
