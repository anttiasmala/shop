import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { cartUtilFunctions } from '~/backend/cart/utils';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { uuidSchema } from '~/shared/zodSchemas';

export default function LinkCartHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reqMethod = req.method;

    if (reqMethod === 'POST') {
      return handlePOST(req, res);
    }

    return res.status(405).send('Invalid request method');
  } catch (e) {
    return handleError(res, e);
  }
}

// Updates the cart's expiration date
function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const updateCartSchema = z.object({
    userCartUUID: uuidSchema,
  });
  const parsedLinkCart = updateCartSchema.safeParse(req.body);
  if (!parsedLinkCart.success) {
    console.log(parsedLinkCart.error);
    throw new HttpError('Invalid request body', 400);
  }

  const { userCartUUID } = parsedLinkCart.data;

  // not awaited, not needed
  void cartUtilFunctions
    .updateExpirationDate(userCartUUID)
    .catch((e) => console.error(e));
  res.status(200).send('Cart updated successfully');
}
