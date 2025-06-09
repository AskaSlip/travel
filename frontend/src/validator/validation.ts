import { z } from 'zod';
const passwordValidation = z.string().min(10, {message: "Must be 10 or more characters long"}).max(100).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/, { message: "Password must contain at least one letter, one number and one special character"});
const emailValidation = z.string().email("Invalid email").min(10, {message: "Must be 10 or more characters long"}).regex(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/);
const today = new Date();

export const sighUpSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  username: z.string().min(5, {message: "Must be 5 or more characters long"}).max(100),
});

export const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const forgotPasswordSchema = z.object({
  email: emailValidation,
})

export const changePasswordSchema = z.object({
  currentPassword: passwordValidation,
  newPassword: passwordValidation,
  password_repeat: z.string().min(6, { message: 'Password confirmation is required' }).optional(),
}).refine((data) => data.newPassword === data.password_repeat, {
  message: 'Passwords do not match',
  path: ['password_repeat'],
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordValidation,
  password_repeat: z.string().min(6, { message: 'Password confirmation is required' }).optional(),
}).refine((data) => data.password === data.password_repeat, {
  message: 'Passwords do not match',
  path: ['password_repeat'],
});

//todo потім змінити дату на календар
export const createTripSchema = z.object({
  trip_name: z.string().min(5, {message: "Must be 5 or more characters long"}).max(100).trim(),
  description: z.string().optional().transform(value => (value === "" ? undefined : value)),
  date_of_trip: z
    .string()
    .trim()
    .optional()
    .transform(value => (value ? new Date(value) : null))
    .refine(date => !date || date >= today, { message: "Date cannot be in the past" }),
  trip_picture: z
    .any()
    .optional()
    // .refine((file) => file instanceof File || file === undefined, {
    //   message: "Invalid file format",
    // }),
});

export const tripStopCreateSchema = z.object({
  key: z.string().min(5, { message: 'Must be 5 or more characters long' }).max(100),
  notes: z.string().trim().nullable().optional()
    .transform(value => (value === '' ? null : value)),
  image: z
    .any()
    .optional()
    // .refine((file) => file instanceof File || file === undefined, {
    //   message: "Invalid file format",
    // }),
});

export const tripStopUpdateSchema = tripStopCreateSchema.partial();

export const budgetCategorySchema = z.object({
  category: z.string().min(3, { message: 'Must be 3 or more characters long' }).max(200),
  value: z.string().min(0, { message: 'Budget must be higher than 0' }),
})



export type SignUpFormData = z.infer<typeof sighUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateTripFormData = z.infer<typeof createTripSchema>;
export type TripStopCreateFormData = z.infer<typeof tripStopCreateSchema>;
export type TripStopUpdateFormData = z.infer<typeof tripStopUpdateSchema>;
export type BudgetCategoryFormData = z.infer<typeof budgetCategorySchema>;