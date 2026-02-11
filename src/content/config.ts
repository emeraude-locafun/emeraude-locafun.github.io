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

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    image: z.string().optional(),
  }),
});

const settingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    phoneDisplay: z.string(),
    phoneNumber: z.string(),
    enableWhatsapp: z.boolean().optional(),
    whatsappNumber: z.string().optional(),
    whatsappMessage: z.string().optional(),
  }),
});

export const collections = {
  fleet: fleetCollection,
  sections: sectionsCollection,
    pages: pagesCollection,
    settings: settingsCollection, // <-- Ajout ici


};