import { z } from 'zod';

export const loginScenarioSchema = z.object({
  name: z.string().min(1),
  username: z.string(),
  password: z.string(),
  expectedError: z.string().min(1),
});

export const loginScenariosSchema = z.array(loginScenarioSchema).min(1);
export type LoginScenario = z.infer<typeof loginScenarioSchema>;

export const checkoutCustomerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  postalCode: z.string().min(1),
  tags: z.array(z.string().regex(/^@[\w-]+$/)).min(1),
});

export const checkoutCustomersSchema = z.array(checkoutCustomerSchema).min(1);
export type CheckoutCustomer = z.infer<typeof checkoutCustomerSchema>;

export const uiProductRowSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
});
export type UiProductRow = z.infer<typeof uiProductRowSchema>;

export const apiProductRowSchema = z.object({
  id: z.string().regex(/^\d+$/),
  title: z.string().min(1),
});
export type ApiProductRow = z.infer<typeof apiProductRowSchema>;
