// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // THE FIX: Removed the extra 'src/' from the path.
  // Since import.meta.url evaluates from inside the src/ folder, 
  // the relative path down to the collections is just './content/...'
  loader: glob({ pattern: '**/*.{md,mdx}', base: new URL('./content/blog', import.meta.url) }),
  schema: z.object({
    title: z.string().default('Draft Post'),
    pubDate: z.date().default(() => new Date()),
    description: z.string().default(''),
  }),
});

const brands = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: new URL('./content/brands', import.meta.url) }),
  schema: z.object({
    name: z.string().default('Brand Name'),
    description: z.string().default(''),
  }),
});

export const collections = { blog, brands };