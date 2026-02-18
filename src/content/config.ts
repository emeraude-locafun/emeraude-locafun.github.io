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
    saison: z.string(),
    image: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    iconfirstpage: z.string().optional(),
    image: z.string().optional(),
     showOnHomepage: z.boolean().default(false),
    order: z.number().default(99), 
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

const pricingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    happyHourTitle: z.string().optional(),
    happyHourText: z.string().optional(),
    happyHourSubtext: z.string().optional(),
    pricing_table: z.array(
      z.object({
        name: z.string(),
        price_1h: z.number().nullable().optional(),
        price_2h: z.number().nullable().optional(),
        price_3h: z.number().nullable().optional(),
        price_4h: z.number().nullable().optional(),
        price_day: z.number().nullable().optional(),
      })
    ).optional(),
  }),
});

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    excerpt: z.string(), // Un court résumé pour la carte
    image: z.string().optional(),
    author: z.string().default('L’équipe Émeraude'),
  }),
});

export const collections = {
  fleet: fleetCollection,
  sections: sectionsCollection,
    pages: pagesCollection,
    settings: settingsCollection, 
    pricing: pricingCollection,
      news: newsCollection, 


};