import "server-only";
import { cache } from "react";
import { connectDB } from "./db";
import { models } from "./models";
import { defaultSettings, initialPackages } from "./defaults";
import type { ContentItem, Settings } from "./validation";
export const getContent = cache(async function getContent() {
  const fallback = {
    settings: defaultSettings,
    packages: initialPackages.map((p, i) => ({ ...p, _id: `package-${i}` })),
    portfolio: [],
    beforeAfter: [],
    testimonials: [],
    faqs: [],
  };
  if (!process.env.MONGODB_URI) return fallback;
  try {
    await connectDB();
    const [settings, ...lists] = await Promise.all([
      models.settings.findOne({ key: "main" }).lean(),
      ...(
        [
          "packages",
          "portfolio",
          "beforeAfter",
          "testimonials",
          "faqs",
        ] as const
      ).map((k) =>
        models[k].find({ active: true }).sort({ order: 1, _id: 1 }).lean(),
      ),
    ]);
    const clean = JSON.parse(JSON.stringify(lists)) as ContentItem[][];
    const packages = clean[0].map((item) => {
      const seeded = initialPackages.find((p) => p.name === item.name);
      if (!seeded) return item;
      return {
        ...item,
        nameAr: item.nameAr || seeded.nameAr,
        descriptionAr: item.descriptionAr || seeded.descriptionAr,
        detailsAr: item.detailsAr || seeded.detailsAr,
        includedAr:
          Array.isArray(item.includedAr) && item.includedAr.length
            ? item.includedAr
            : seeded.includedAr,
      };
    });
    return {
      settings: {
        ...defaultSettings,
        ...JSON.parse(JSON.stringify(settings || {})),
      } as Settings,
      packages,
      portfolio: clean[1],
      beforeAfter: clean[2],
      testimonials: clean[3],
      faqs: clean[4],
    };
  } catch (error) {
    console.error("Unable to load website content", error);
    return fallback;
  }
});
