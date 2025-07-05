import { z } from 'zod';
import { emailRegex, passwordRegex } from './regexPatterns';

// MISC SCHEMAS
export const uuidSchema = z
  .string({ message: 'Invalid UUID! It should be given as a string!' })
  .uuid('UUID pattern was invalid!');

export const dateSchema = z
  .string()
  .min(1, 'Date is mandatory!')
  .datetime({ message: 'Given date is invalid!' })
  .pipe(z.coerce.date());

export const firstNameSchema = z
  .string()
  .min(1, 'First name is mandatory!')
  .max(128, 'Firstname is too long, maximum length is 128 characters');

export const lastNameSchema = z
  .string()
  .min(1, 'Last name is mandatory!')
  .max(128, 'Lastname is too long, maximum length is 128 characters');

export const emailSchema = z
  .string()
  .min(1, 'Email is mandatory!')
  .max(128, 'Email is too long, maximum length is 128 characters')
  .regex(emailRegex, 'Email is invalid')
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(1, 'Password is mandatory!')
  .max(128, 'Password is too long, maximum length is 128 characters')
  .regex(
    passwordRegex,

    'Password has to include at least 8 characters, it can be at maximum 128 characters long, it has to include at least one uppercase and lowercase letter, one number, and one special character!',
  );

// PRODUCT

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string(),
  category: z.string(),
});

export const createProductSchema = productSchema.omit({
  id: true,
});

export const patchProductSchema = createProductSchema;

// CART

export const cartSchema = productSchema
  .extend({
    amount: z.number(),
  })
  .array();

export const createCartSchema = z.object({
  cartUUID: uuidSchema,
});

export const linkCartSchema = z.object({
  cartUUID: uuidSchema,
  userUUID: uuidSchema,
});

// CART ITEM

export const fullCartItemSchema = z.object({
  id: z.number().min(1, 'ID is mandatory!'),
  uuid: uuidSchema,
  productUUID: z.number().min(1, 'Product UUID is mandatory!'),
  cartUUID: z.number().min(1, 'Cart UUID is mandatory!'),
  amount: z.number().min(1, 'Amount is mandatory!'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const cartItemSchema = fullCartItemSchema.pick({
  id: true,
  uuid: true,
  productUUID: true,
  amount: true,
});

export const createCartItemSchema = cartItemSchema.pick({
  id: true,
  amount: true,
});

export const deleteCartItemSchema = z.object({
  productId: z.string(),
});

export const patchCartItemSchema = createCartItemSchema;

// USER SCHEMAS

export const fullUserSchema = z.object({
  id: z.number().min(1, 'ID is mandatory!'),
  uuid: uuidSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userSchema = fullUserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
});

export const getUserSchema = fullUserSchema
  .pick({
    uuid: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  })
  .merge(userSchema);

export const createUserSchema = userSchema.extend({
  password: passwordSchema,
});

export const userLoginDetailsSchema = createUserSchema.pick({
  email: true,
  password: true,
});

// SESSION SCHEMAS

export const fullSessionSchema = z.object({
  uuid: uuidSchema,
  userUUID: uuidSchema,
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isLoggedIn: z.boolean(),
});

export const getSessionSchema = fullSessionSchema.pick({
  uuid: true,
  userUUID: true,
  expiresAt: true,
  isLoggedIn: true,
});

export const sessionSchema = getSessionSchema;

export const frontendSessionSchema = getSessionSchema.extend({
  fresh: z.boolean(),
});

export const createSessionSchema = getSessionSchema.pick({
  uuid: true,
  userUUID: true,
  expiresAt: true,
});

export const validSessionResultSchema = z.object({
  status: z.literal('valid'),
  databaseSession: sessionSchema,
  databaseUser: getUserSchema,
});

export const invalidSessionResultSchema = z.object({
  status: z.literal('invalid'),
  databaseSession: z.null(),
  databaseUser: z.null(),
});

// LOGIN

export const loginDetailsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

// LOCALSTORAGE

export const cartSettingsSchema = z.object({
  isLoggedIn: z.boolean(),
  isCartLinked: z.boolean(),
});
