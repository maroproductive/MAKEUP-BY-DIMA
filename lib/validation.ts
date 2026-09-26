import { z } from "zod";
const text = (max = 500) => z.string().trim().max(max);
const url = z.union([
  z.literal(""),
  z
    .string()
    .url()
    .refine((v) => v.startsWith("https://"), "Use an HTTPS URL"),
]);
const image = z.union([
  z.literal(""),
  z
    .string()
    .url()
    .refine((v) => {
      try {
        return (
          ["res.cloudinary.com", "images.unsplash.com"].includes(
            new URL(v).hostname,
          ) && v.startsWith("https://")
        );
      } catch {
        return false;
      }
    }, "Use a Cloudinary image URL or upload an image"),
]);
const base = {
  order: z.coerce.number().int().min(0).max(10000),
  active: z.boolean(),
};
export const schemas = {
  packages: z.object({
    ...base,
    name: text(100).min(1),
    price: z.coerce.number().min(0).max(100000),
    description: text().min(1),
    details: text(5000),
    included: z.array(text(200)).max(30),
    image,
  }),
  portfolio: z.object({
    ...base,
    title: text(150).min(1),
    category: text(80),
    image: image.refine(Boolean, "Image is required"),
  }),
  beforeAfter: z.object({
    ...base,
    title: text(150).min(1),
    description: text(1500),
    beforeImage: image.refine(Boolean, "Before image is required"),
    afterImage: image.refine(Boolean, "After image is required"),
  }),
  testimonials: z.object({
    ...base,
    name: text(100).min(1),
    review: text(2000).min(1),
    image,
    rating: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]),
  }),
  faqs: z.object({
    ...base,
    question: text(300).min(1),
    answer: text(3000).min(1),
  }),
  settings: z.object({
    businessName: text(100).min(1),
    bio: text(1500),
    heroHeadline: text(200),
    heroDescription: text(1000),
    heroImage: image.default(""),
    whatsapp: z
      .string()
      .trim()
      .regex(/^(\+?[1-9]\d{6,14})?$/, "Enter international digits, e.g. +961…"),
    instagramUrl: url,
    mapsUrl: url,
    footerUrl: url,
  }),
};
export type Collection = keyof typeof schemas;
export type Settings = z.infer<typeof schemas.settings>;
export type ContentItem = {
  _id: string;
  order: number;
  active: boolean;
  [key: string]: string | number | boolean | string[];
};
export function whatsappLink(number: string, name?: string, price?: number | string) {
  if (!number) return null;
  const packageMessage = name
    ? `Hello, I’m interested in the ${name} package${price !== undefined && price !== "" ? ` (${price})` : ""}. I would like to know more and book an appointment.`
    : "Hello, I would like to know more and book a makeup appointment.";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(packageMessage)}`;
}
