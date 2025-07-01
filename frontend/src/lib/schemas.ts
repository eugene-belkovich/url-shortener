import { z } from 'zod'

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'Url min line length is 1 character')
    .url('Введите корректный URL'),
})

export const urlSchema = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
  slug: z.string(),
  shortUrl: z.string().url(),
  clickCount: z.number().int().min(0),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type CreateUrlFormData = z.infer<typeof createUrlSchema>

export type Url = z.infer<typeof urlSchema>
