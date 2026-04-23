import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().default("Draft Post"),
    pubDate: z.date().default(() => new Date()),
    description: z.string().default("")
  })
});

const brands = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/brands" }),
  schema: z.object({
    name: z.string().default("Brand Name"),
    description: z.string().default("")
  })
});

export const collections = { blog, brands };