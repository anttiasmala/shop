import { z } from 'zod';
import { cartSchema, productSchema } from './zodSchemas';

export type Product = z.infer<typeof productSchema>;

export type Cart = z.infer<typeof cartSchema>;
