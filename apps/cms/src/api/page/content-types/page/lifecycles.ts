export default {
  lifecycles: {
    beforeCreate(event: { params: { data: Record<string, unknown> } }) {
      const { data } = event.params;
      if (!data.slug && data.title) {
        const baseSlug = (data.title as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        event.params.data.slug = baseSlug;
      }
    },
  },
};
