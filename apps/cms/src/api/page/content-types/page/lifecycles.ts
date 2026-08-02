export default {
  lifecycles: {
    beforeCreate(event) {
      const { data } = event.params;
      if (!data.slug && data.title) {
        const baseSlug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        event.params.data.slug = baseSlug;
      }
    },
  },
};
