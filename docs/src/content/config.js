import { z, defineCollection } from 'astro:content';

const componentsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    tabs: z.string().array(),
    specName: z.string(),
    description: z.string(),
    tags: z.array(z.string())
  })
});

export const collections = {
  components: componentsCollection,
};
