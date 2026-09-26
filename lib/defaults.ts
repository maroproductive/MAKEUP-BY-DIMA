import type { Settings } from "./validation";
export const defaultSettings: Settings = {
  businessName: "Makeup by Dima",
  bio: "A little artistry. A lot of you. Thoughtfully created makeup that celebrates your natural beauty and makes every moment feel special.",
  heroHeadline: "Beauty,\nDefined by You.",
  heroDescription:
    "Soft glam, bridal looks, and timeless makeup tailored to you.",
  heroImage: "",
  whatsapp: "+96171074682",
  instagramUrl: "https://www.instagram.com/makeupbyydima?stkn=MXRpZnlzZHNxNXp6eQ==",
  mapsUrl: "",
  footerUrl: "",
};
export const initialPackages = [
  {
    name: "Simple Makeup",
    price: 20,
    description: "A fresh, effortless glow for your everyday special moments.",
    details: "A soft makeup look tailored to your features and personal style.",
    included: ["Skin preparation", "Natural complexion", "Soft eyes & lips"],
    image: "",
    order: 0,
    active: true,
  },
  {
    name: "Simple Makeup + Eyelashes",
    price: 25,
    description: "Your natural beauty, with a little extra definition.",
    details:
      "Our soft signature makeup, finished with eyelashes to bring out your eyes.",
    included: [
      "Everything in Simple Makeup",
      "Eyelashes",
      "Personalized eye look",
    ],
    image: "",
    order: 1,
    active: true,
  },
  {
    name: "Engagement",
    price: 40,
    description: "A romantic, radiant look for the beginning of forever.",
    details:
      "An elevated look created around your outfit, features, and engagement celebration.",
    included: [
      "Skin preparation",
      "Full makeup application",
      "Eyelashes",
      "Detailed finishing",
    ],
    image: "",
    order: 2,
    active: true,
  },
  {
    name: "Bride",
    price: 80,
    description: "Timeless beauty for your most unforgettable day.",
    details:
      "A thoughtfully designed bridal look. Message Dima to discuss your wedding date, preferences, and appointment details.",
    included: [
      "Personalized bridal look",
      "Skin preparation",
      "Eyelashes",
      "Detailed finishing",
    ],
    image: "",
    order: 3,
    active: true,
  },
];
