import { z, defineCollection } from 'astro:content';

const componentsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    specName: z.string(),
    description: z.string(),
    tags: z.array(z.string())
  })
});

export const collections = {
  components: componentsCollection,
};
