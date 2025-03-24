import { z } from 'zod';

export const sighUpSchema = z.object({
  email: z.string().email("Invalid email").min(10, {message: "Must be 10 or more characters long"}).regex(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/),
  password: z.string().min(10, {message: "Must be 10 or more characters long"}).max(100).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/, { message: "Password must contain at least one letter, one number and one special character"}),
  username: z.string().min(5, {message: "Must be 5 or more characters long"}).max(100),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email").min(10, {message: "Must be 10 or more characters long"}).regex(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/),
  password: z.string().min(10, {message: "Must be 10 or more characters long"}).max(100).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/, { message: "Password must contain at least one letter, one number and one special character"}),
});

export type SignUpFormData = z.infer<typeof sighUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;