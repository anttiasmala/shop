import { NextApiRequest, NextApiResponse } from 'next';
import { unLinkUserAndCart } from '~/backend/cart/utils';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { linkCartSchema } from '~/shared/zodSchemas';

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

function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const parsedLinkCart = linkCartSchema.safeParse(req.body);
  if (!parsedLinkCart.success) {
    console.log(parsedLinkCart.error);
    throw new HttpError('Invalid request body', 400);
  }

  const { cartUUID, userUUID } = parsedLinkCart.data;

  // not awaited, not needed
  void unLinkUserAndCart(cartUUID, userUUID);
  res.status(200).send('Cart linked successfully');
}
