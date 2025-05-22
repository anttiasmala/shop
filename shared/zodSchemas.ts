import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.string(),
  image: z.string(),
  description: z.string(),
  category: z.string(),
});

export const cartSchema = productSchema
  .extend({
    amount: z.number(),
  })
  .array();
