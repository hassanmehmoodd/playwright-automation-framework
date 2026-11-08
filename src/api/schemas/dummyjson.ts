import { z } from 'zod';

export const productSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    price: z.number().nonnegative(),
    rating: z.number(),
    stock: z.number().int(),
    thumbnail: z.string().url(),
    images: z.array(z.string().url()).min(1),
  })
  .passthrough();

export type Product = z.infer<typeof productSchema>;

export const productListSchema = z
  .object({
    products: z.array(productSchema).min(1),
    total: z.number().int().nonnegative(),
    skip: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  })
  .passthrough();

export type ProductList = z.infer<typeof productListSchema>;

export const authSessionSchema = z
  .object({
    accessToken: z.string().min(20),
    refreshToken: z.string().min(20),
    id: z.number().int().positive(),
    username: z.string().min(1),
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .passthrough();

export type AuthSession = z.infer<typeof authSessionSchema>;

export const currentUserSchema = z
  .object({
    id: z.number().int().positive(),
    username: z.string().min(1),
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .passthrough();

export type CurrentUser = z.infer<typeof currentUserSchema>;

export const userSchema = z
  .object({
    id: z.number().int().positive(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z.string().min(1),
    email: z.string().email(),
    age: z.number().int().positive(),
  })
  .passthrough();

export const userListSchema = z
  .object({
    users: z.array(userSchema).min(1),
    total: z.number().int().nonnegative(),
    skip: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  })
  .passthrough();

export type UserList = z.infer<typeof userListSchema>;

export const apiErrorSchema = z
  .object({
    message: z.string().min(1),
  })
  .passthrough();

export type ApiErrorBody = z.infer<typeof apiErrorSchema>;
