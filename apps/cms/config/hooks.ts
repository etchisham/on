export default ({ env }) => ({
  enabled: true,
  resolver: {
    collection: {
      page: {
        fields: true,
      },
      'site-setting': {
        fields: true,
      },
    },
  },
  hooks: {
    beforeCreate: (ctx) => {
      const sanitizedData = sanitizeInput(ctx.params.data);
      ctx.params.data = sanitizedData;
    },
    beforeUpdate: (ctx) => {
      const sanitizedData = sanitizeInput(ctx.params.data);
      ctx.params.data = sanitizedData;
    },
  },
});

function sanitizeInput(data: Record<string, unknown>): Record<string, unknown> {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  const sanitize = (obj: unknown): unknown => {
    if (typeof obj === 'string') {
      let sanitized = obj;
      for (const pattern of dangerousPatterns) {
        sanitized = sanitized.replace(pattern, '');
      }
      return sanitized;
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = sanitize(value);
      }
      return result;
    }
    return obj;
  };

  return sanitize(data) as Record<string, unknown>;
}
