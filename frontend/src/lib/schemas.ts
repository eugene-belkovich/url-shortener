import {z} from 'zod'

export const createUrlSchema = z.object({
  originalUrl: z.string().min(1, 'Url min line length is 1 character').url('Please enter a valid URL'),
})

export const urlSchema = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
  slug: z.string(),
  shortUrl: z.string().url(),
  clicks: z.number().int().min(0),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
})

export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type CreateUrlFormData = z.infer<typeof createUrlSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export type Url = z.infer<typeof urlSchema>
