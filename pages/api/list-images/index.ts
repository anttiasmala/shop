import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import { handleError } from '~/backend/handleError';
import { z } from 'zod';
import { HttpError } from '~/backend/HttpError';

const PATH = './public/images/products';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'GET') {
      return await handleGET(req, res);
    }
    if (req.method === 'PUT') {
      return await handlePUT(req, res);
    }
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const files = await fs.readdir(PATH);
  console.log(files);
  return res.status(200).json(files);
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  // parse req.body to check that the array is full of strings
  const parsedReqBody = z.string().array().safeParse(req.body);

  // if parsing fails, throw an error
  if (parsedReqBody.success === false) {
    throw new HttpError('Invalid request body', 400);
  }

  const reqBody = parsedReqBody.data;

  // read the current files
  const files = await fs.readdir(PATH);

  // filter out the only file that does not exist in reqBody array. It is the old name of the file
  const oldFileName = files.filter((value) => {
    return !reqBody.includes(value);
  });

  // filter out from the new files the file that is not in files. It is the new name in the files
  const newFileName = reqBody.filter((value) => {
    return !files.includes(value);
  });

  // if there are more than 1 files, throw an error. We'll do only one file at the time
  if (oldFileName.length > 1 || newFileName.length > 1) {
    throw new Error('Only one file is allowed to be changed at a time');
  }

  // rename the file from old name to the new name
  await fs.rename(`${PATH}/${oldFileName[0]}`, `${PATH}/${newFileName[0]}`);
  res.status(200).end();
  return;
}
