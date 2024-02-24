import { z } from "zod";

export const createUserValidation = z.object({
  userId: z.string({
    required_error: `useId is required!`,
    invalid_type_error: `Invalid ID!`,
  }),
  email: z
    .string({
      required_error: `Email is required!`,
      invalid_type_error: `Invalid email!`,
    })
    .email({ message: `Invalid email address!` }),
  mobile: z
    .string({
      required_error: `Mobile is required!`,
      invalid_type_error: `Invalid mobile!`,
    })
    .refine((value) => /^\d{11}$/.test(value), {
      message: "Mobile number must be a 11-digit number.",
    }),
  password: z.string({
    required_error: `Password is required!`,
    invalid_type_error: `Invalid password!`,
  }),
});

export const updateUserValidation = createUserValidation.partial();

export const ZodValidations = { createUserValidation, updateUserValidation };
