import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.string(),
  image: z.string(),
  description: z.string().optional(),
});
