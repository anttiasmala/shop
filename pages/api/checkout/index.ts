import { NextApiRequest, NextApiResponse } from 'next';
import { HttpError } from '~/backend/HttpError';
import { fullCheckoutSchema } from '~/shared/zodSchemas';
import prisma from '~/prisma';

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const reqBodyParse = fullCheckoutSchema.safeParse(req.body);

  if (!reqBodyParse.success) {
    throw new HttpError('Invalid request body', 400);
  }

  console.log(reqBodyParse.data);

  res.status(200).end();
}
