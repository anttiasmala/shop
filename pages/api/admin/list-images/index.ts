import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import { handleError } from '~/backend/handleError';
import { z } from 'zod';
import { HttpError } from '~/backend/HttpError';
import { validateRequest } from '~/backend/auth/auth';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';

const PATH = './public/images/products';

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const isAdmin = checkIsAdminFromValidateRequest(
      await validateRequest(req, res),
    );

    // user is not Admin, throw an error
    if (!isAdmin) {
      throw new HttpError("You don't have privileges to do that", 400);
    }

    if (req.method === 'GET') {
      return await handleGET(req, res);
    }
    if (req.method === 'PUT') {
      return await handlePUT(req, res);
    }
    if (req.method === 'DELETE') {
      return await handleDELETE(req, res);
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
    throw new HttpError(
      'Only one file is allowed to be changed at a time',
      400,
    );
  }

  // rename the file from old name to the new name
  await fs.rename(`${PATH}/${oldFileName[0]}`, `${PATH}/${newFileName[0]}`);
  res.status(200).end();
  return;
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const parsedReqBody = z.string().safeParse(req.body);

  if (parsedReqBody.success === false) {
    throw new HttpError('Invalid request body', 400);
  }

  const reqBody = parsedReqBody.data;

  const files = await fs.readdir(PATH);

  if (!files.includes(reqBody)) {
    throw new HttpError('Invalid file name', 400);
  }

  await fs.unlink(`${PATH}/${reqBody}`);

  res.status(200).end();
  return;
}
