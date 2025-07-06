import { z } from 'zod';
import {
  cartSchema,
  cartSettingsSchema,
  createSessionSchema,
  createUserSchema,
  deleteCartItemSchema,
  frontendSessionSchema,
  fullSessionSchema,
  fullUserSchema,
  getSessionSchema,
  getUserSchema,
  invalidSessionResultSchema,
  patchCartItemSchema,
  productSchema,
  sessionSchema,
  userLoginDetailsSchema,
  userSchema,
  validSessionResultSchema,
} from './zodSchemas';

// PRODUCT
export type Product = z.infer<typeof productSchema>;

// CART

export type Cart = z.infer<typeof cartSchema>;

export type GetCart = { amount: number } & { Product: Product };

// CART ITEM

export type PatchCartItem = z.infer<typeof patchCartItemSchema>;

export type DeleteCartItem = z.infer<typeof deleteCartItemSchema>;

// USER

export type FullUser = z.infer<typeof fullUserSchema>;

export type User = z.infer<typeof userSchema>;

export type GetUser = z.infer<typeof getUserSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

// SESSION

export type FullSession = z.infer<typeof fullSessionSchema>;

export type Session = z.infer<typeof sessionSchema>;

export type GetSession = z.infer<typeof getSessionSchema>;

export type FrontendSession = z.infer<typeof frontendSessionSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;

type validSessionResult = z.infer<typeof validSessionResultSchema>;

type invalidSessionResult = z.infer<typeof invalidSessionResultSchema>;

export type GetUserAndSessionResult = validSessionResult | invalidSessionResult;

// DATABASE

export type DatabaseAdapter = {
  createSession: (sessionData: CreateSession) => Promise<Session | null>;
  deleteSession: (sessionUUID: string) => Promise<void>;

  //prettier-ignore

  /* No use for these? */
  //getSession: (sessionUUID: string) => Promise<Session | null>;
  //getUserFromSession: (sessionUUID: string) => Promise<User | null>; // potentially a dangerous function
  //getUserAndSessions: (userUUID: string) => Promise<[Session[], User] | null>; // gets the user and ALL the sessions

  // prettier-ignore
  //prettier-ignore
  getUserAndSession: (sessionUUID: string) => Promise<GetUserAndSessionResult>; // gets the user and ONLY ONE session
  getUserSessions: (userUUID: string) => Promise<Session[]>; // gets all the sessions belonging to a ONE user
  // prettier-ignore
  updateSessionExpirationDate: (sessionUUID: string, newSessionExpirationDate: Date) => Promise<void>;
  deleteUserSessions: (userUUID: string) => Promise<void>; // deletes all the sessions belonging to a user
  deleteExpiredSessions: () => Promise<void>;
};

export const QueryAndMutationKeys = {
  NavBarProducts: ['NavBarProducts'],
  CartProducts: ['CartProducts'],
  ReduceProductAmount: ['ReduceProductAmount'],
  Products: ['products'],
  Product: ['product'],
  Images: ['images'],
  UpdateCartTotalAmount: ['updateCartTotalAmount'],
  Login: ['login'],
  Register: ['register'],
  Logout: ['logout'],
};

// LOCALSTORAGE

export type CartSettings = z.infer<typeof cartSettingsSchema>;

// MISC

export type KeyboardEventKeys =
  | ' ' // Space
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '_'
  | '+'
  | '-'
  | '='
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Pause/Break'
  | 'Caps Lock'
  | 'Escape'
  | 'Space'
  | 'Page Up'
  | 'Page Down'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Insert'
  | 'Delete'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'Num Lock'
  | 'Scroll Lock';
