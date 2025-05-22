import { z } from 'zod';
import {
  cartSchema,
  createSessionSchema,
  createUserSchema,
  frontendSessionSchema,
  fullSessionSchema,
  fullUserSchema,
  getSessionSchema,
  getUserSchema,
  invalidSessionResultSchema,
  productSchema,
  sessionSchema,
  userSchema,
  validSessionResultSchema,
} from './zodSchemas';

export type Product = z.infer<typeof productSchema>;

export type Cart = z.infer<typeof cartSchema>;

// USER

export type FullUser = z.infer<typeof fullUserSchema>;

export type User = z.infer<typeof userSchema>;

export type GetUser = z.infer<typeof getUserSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;

// SESSION

export type FullSession = z.infer<typeof fullSessionSchema>;

export type Session = z.infer<typeof sessionSchema>;

export type GetSession = z.infer<typeof getSessionSchema>;

export type FrontendSession = z.infer<typeof frontendSessionSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;

type validSessionResult = z.infer<typeof validSessionResultSchema>;

type invalidSessionResult = z.infer<typeof invalidSessionResultSchema>;

export type GetUserAndSessionResult = validSessionResult | invalidSessionResult;
