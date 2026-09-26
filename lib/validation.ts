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
const translatedText = (max = 500) => text(max).optional().default("");
const translatedList = z.array(text(200)).max(30).optional().default([]);
const base = {
  order: z.coerce.number().int().min(0).max(10000),
  active: z.boolean(),
};
export const schemas = {
  packages: z.object({
    ...base,
    name: text(100).min(1),
    nameAr: translatedText(100),
    price: z.coerce.number().min(0).max(100000),
    description: text().min(1),
    descriptionAr: translatedText(),
    details: text(5000),
    detailsAr: translatedText(5000),
    included: z.array(text(200)).max(30),
    includedAr: translatedList,
    image,
  }),
  portfolio: z.object({
    ...base,
    title: text(150).min(1),
    titleAr: translatedText(150),
    category: text(80),
    categoryAr: translatedText(80),
    image: image.refine(Boolean, "Image is required"),
  }),
  beforeAfter: z.object({
    ...base,
    title: text(150).min(1),
    titleAr: translatedText(150),
    description: text(1500),
    descriptionAr: translatedText(1500),
    beforeImage: image.refine(Boolean, "Before image is required"),
    afterImage: image.refine(Boolean, "After image is required"),
  }),
  testimonials: z.object({
    ...base,
    name: text(100).min(1),
    nameAr: translatedText(100),
    review: text(2000).min(1),
    reviewAr: translatedText(2000),
    image,
    rating: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]),
  }),
  faqs: z.object({
    ...base,
    question: text(300).min(1),
    questionAr: translatedText(300),
    answer: text(3000).min(1),
    answerAr: translatedText(3000),
  }),
  settings: z.object({
    businessName: text(100).min(1),
    businessNameAr: translatedText(100),
    bio: text(1500),
    bioAr: translatedText(1500),
    heroHeadline: text(200),
    heroHeadlineAr: translatedText(200),
    heroDescription: text(1000),
    heroDescriptionAr: translatedText(1000),
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
export function whatsappLink(
  number: string,
  name?: string,
  price?: number | string,
  language: "en" | "ar" = "en",
) {
  if (!number) return null;
  const hasPrice = price !== undefined && price !== "";
  const packageMessage =
    language === "ar"
      ? name
        ? `مرحباً ديما، أنا مهتمة بباقة ${name}${hasPrice ? ` بسعر $${price}` : ""} وأرغب بمعرفة المزيد وحجز موعد.`
        : "مرحباً ديما، أرغب بمعرفة المزيد وحجز موعد مكياج."
      : name
        ? `Hello, I’m interested in the ${name} package${hasPrice ? ` ($${price})` : ""}. I would like to know more and book an appointment.`
        : "Hello, I would like to know more and book a makeup appointment.";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(packageMessage)}`;
}
