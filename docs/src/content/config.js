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
const examplesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.optional(z.string()),
    title: z.string(),
    fold: z.optional(z.boolean()),
    shortTitle: z.optional(z.string()),
    category: z.string(),
    folder: z.optional(z.string()),
    subcategory: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    exampleType: z.string(),
  })
});

const learnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.optional(z.string()),
    order: z.optional(z.string()),
    title: z.string(),
    category: z.string(),
    shortTitle: z.optional(z.string()),
    tags: z.optional(z.array(z.string())),
  })
});


export const collections = {
  components: componentsCollection,
  examples: examplesCollection,
  learn: learnCollection,
};
