import { z } from 'zod';
import { productSchema } from './zodSchemas';

export type Product = z.infer<typeof productSchema>;
