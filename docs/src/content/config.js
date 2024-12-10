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
    hidden: z.optional(z.boolean()),
    exampleType: z.string(),
    folder: z.optional(z.string()), // whether all files in folder should be included in example
    fold: z.optional(z.boolean()),
    category: z.optional(z.string()),
    selectedFile: z.optional(z.string()),
    subcategory: z.string(),
    description: z.string(),
    tip: z.optional(z.string()),
    tags: z.array(z.string()),
    shortTitle: z.optional(z.string()), // name for appearance in small menus
  })
});

const resourceSchema = z.object({
  title: z.string(),
  link: z.string()
});

const lessonCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hidden: z.optional(z.boolean()),
    id: z.optional(z.string()), // use instead of slug
    sort: z.string(), // the actual sort like 1.1.1
    category: z.string(), // 1.x.x - name for category
    subcategory: z.string(), // x.1.x - name for subcategory
    title: z.string(), // x.x.1 - lesson title
    hint: z.optional(z.string()), // a hint to help solve coding problems
    references: z.array(resourceSchema).optional(), // array of related ref links
    shortTitle: z.optional(z.string()), // name for appearance in small menus
    tags: z.optional(z.array(z.string())), // for search
    hideNavigation: z.optional(z.boolean()),
  })
});


export const collections = {
  components: componentsCollection,
  examples: examplesCollection,
  lessons: lessonCollection,
};
