import { describe, it, expect } from 'vitest';
import { validateFaqItems, faqItemSchema, isValidLocale } from './faq';

describe('FAQ Validation', () => {
  describe('faqItemSchema', () => {
    it('accepts valid FAQ item with all fields', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc123',
        question: 'What is this?',
        answer: 'This is an answer.',
        sortOrder: 1,
      });
      expect(result.success).toBe(true);
    });

    it('accepts FAQ item with missing optional fields', () => {
      const result = faqItemSchema.safeParse({
        id: 1,
        documentId: 'xyz',
        question: 'Question text?',
        answer: 'Answer text here.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects FAQ with missing required question', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        answer: 'Answer.',
      });
      expect(result.success).toBe(false);
    });

    it('rejects FAQ with missing required answer', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Question?',
      });
      expect(result.success).toBe(false);
    });

    it('rejects question shorter than minimum', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Wha?',
        answer: 'Valid answer here.',
      });
      expect(result.success).toBe(false);
    });

    it('rejects answer shorter than minimum', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Valid question?',
        answer: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('rejects question longer than maximum', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'x'.repeat(501),
        answer: 'Valid answer.',
      });
      expect(result.success).toBe(false);
    });

    it('rejects answer longer than maximum', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Valid question?',
        answer: 'x'.repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid locale', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Question?',
        answer: 'Answer.',
        locale: 'de',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid en locale', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Question text?',
        answer: 'Answer text here.',
        locale: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid ar locale', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: 'Question text?',
        answer: 'Answer text here.',
        locale: 'ar',
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from question and answer', () => {
      const result = faqItemSchema.safeParse({
        documentId: 'abc',
        question: '  Question?  ',
        answer: '  Answer text.  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.question).toBe('Question?');
        expect(result.data.answer).toBe('Answer text.');
      }
    });
  });

  describe('validateFaqItems', () => {
    it('returns empty array for null input', () => {
      const result = validateFaqItems(null);
      expect(result).toEqual([]);
    });

    it('returns empty array for undefined input', () => {
      const result = validateFaqItems(undefined);
      expect(result).toEqual([]);
    });

    it('returns empty array for invalid input', () => {
      const result = validateFaqItems('not an array');
      expect(result).toEqual([]);
    });

    it('validates and returns valid items', () => {
      const input = [
        { documentId: '1', question: 'Q1 text here?', answer: 'A1 text here.' },
        { documentId: '2', question: 'Q2 text here?', answer: 'A2 text here.' },
      ];
      const result = validateFaqItems(input);
      expect(result.length).toBe(2);
    });

    it('filters out invalid items', () => {
      const input = [
        { documentId: '1', question: 'Q1 text here?', answer: 'A1 text here.' },
        { documentId: '2', question: 'Short', answer: 'Short' },
      ];
      const result = validateFaqItems(input);
      expect(result.length).toBe(1);
      expect(result[0].documentId).toBe('1');
    });

    it('limits to maximum 100 items', () => {
      const input = Array(110).fill(null).map((_, i) => ({
        documentId: `id-${i}`,
        question: `Question number ${i} here?`,
        answer: `Answer number ${i} text here.`,
      }));
      const result = validateFaqItems(input);
      expect(result.length).toBe(100);
    });
  });

  describe('isValidLocale', () => {
    it('returns true for en', () => {
      expect(isValidLocale('en')).toBe(true);
    });

    it('returns true for ar', () => {
      expect(isValidLocale('ar')).toBe(true);
    });

    it('returns false for de', () => {
      expect(isValidLocale('de')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidLocale(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidLocale('')).toBe(false);
    });
  });
});
