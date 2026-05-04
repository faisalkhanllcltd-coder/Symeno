// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Use robust URL resolution for the glob base to prevent pathing errors
  loader: glob({ pattern: '**/*.{md,mdx}', base: new URL('./src/content/blog', import.meta.url) }),
  schema: z.object({
    title: z.string().default('Draft Post'),
    pubDate: z.date().default(() => new Date()),
    description: z.string().default(''),
  }),
});

const brands = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: new URL('./src/content/brands', import.meta.url) }),
  schema: z.object({
    name: z.string().default('Brand Name'),
    description: z.string().default(''),
  }),
});

export const collections = { blog, brands };