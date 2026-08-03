import { z } from 'zod';

export const faqItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional(),
  documentId: z.string().min(1).max(128),
  question: z.string().trim().min(5).max(500),
  answer: z.string().trim().min(10).max(2000),
  sortOrder: z.number().int().min(0).default(0),
  locale: z.enum(['en', 'ar']).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const faqArraySchema = z.array(faqItemSchema).max(100);

export type ValidatedFaqItem = z.infer<typeof faqItemSchema>;

export function validateFaqItems(data: unknown): ValidatedFaqItem[] {
  if (!Array.isArray(data)) {
    console.error('FAQ array validation error: Expected array');
    return [];
  }
  const sliced = data.slice(0, 100);
  const validItems: ValidatedFaqItem[] = [];
  for (const item of sliced) {
    const result = faqItemSchema.safeParse(item);
    if (result.success) {
      validItems.push(result.data);
    }
  }
  return validItems;
}

export function isValidLocale(locale: string | undefined): locale is 'en' | 'ar' {
  return locale === 'en' || locale === 'ar';
}
