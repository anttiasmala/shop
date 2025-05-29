import { NextApiRequest, NextApiResponse } from 'next';

export default function UploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.method);
  res.status(200).end();
}
