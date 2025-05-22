import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const requestMethod = req.method;
  if (requestMethod === 'GET') {
  }

  if (requestMethod === 'POST') {
  }
  res.status(200).end();
}

async function handleGET() {}

function handlePOST() {}
