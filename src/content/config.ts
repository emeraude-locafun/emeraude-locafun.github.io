import { z, defineCollection } from 'astro:content';

const fleetCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(["Catamaran", "Kayak", "Paddle", "Dériveur"]),
    capacity: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

const sectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  fleet: fleetCollection,
  sections: sectionsCollection,
};