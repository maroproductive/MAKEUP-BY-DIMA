import type { Settings } from "./validation";
export const defaultSettings: Settings = {
  businessName: "Makeup by Dima",
  businessNameAr: "ميك أب باي ديما",
  bio: "A little artistry. A lot of you. Thoughtfully created makeup that celebrates your natural beauty and makes every moment feel special.",
  bioAr:
    "لمسة فنية تعبّر عنكِ. مكياج مصمم بعناية ليبرز جمالكِ الطبيعي ويجعل كل لحظة أكثر تميزاً.",
  heroHeadline: "Beauty,\nDefined by You.",
  heroHeadlineAr: "جمالكِ،\nبأسلوبكِ.",
  heroDescription:
    "Soft glam, bridal looks, and timeless makeup tailored to you.",
  heroDescriptionAr:
    "مكياج ناعم، إطلالات عروس، ولمسات خالدة مصممة خصيصاً لكِ.",
  heroImage: "",
  whatsapp: "+96171074682",
  instagramUrl:
    "https://www.instagram.com/makeupbyydima?stkn=MXRpZnlzZHNxNXp6eQ==",
  mapsUrl: "",
  footerUrl: "",
};
export const initialPackages = [
  {
    name: "Simple Makeup",
    nameAr: "مكياج ناعم",
    price: 20,
    description: "A fresh, effortless glow for your everyday special moments.",
    descriptionAr: "إطلالة ناعمة ومشرقة لمناسباتكِ اليومية واللحظات الخاصة.",
    details: "A soft makeup look tailored to your features and personal style.",
    detailsAr: "إطلالة مكياج ناعمة مصممة لتناسب ملامحكِ وأسلوبكِ الشخصي.",
    included: ["Skin preparation", "Natural complexion", "Soft eyes & lips"],
    includedAr: ["تحضير البشرة", "بشرة طبيعية ومشرقة", "عيون وشفاه ناعمة"],
    image: "",
    order: 0,
    active: true,
  },
  {
    name: "Simple Makeup + Eyelashes",
    nameAr: "مكياج ناعم + رموش",
    price: 25,
    description: "Your natural beauty, with a little extra definition.",
    descriptionAr: "جمالكِ الطبيعي مع لمسة إضافية تبرز تفاصيل عينيكِ.",
    details:
      "Our soft signature makeup, finished with eyelashes to bring out your eyes.",
    detailsAr:
      "إطلالتنا الناعمة المميزة مع رموش لإبراز العينين وإكمال اللوك.",
    included: [
      "Everything in Simple Makeup",
      "Eyelashes",
      "Personalized eye look",
    ],
    includedAr: ["كل ما يشمله المكياج الناعم", "رموش", "إطلالة عيون مخصصة"],
    image: "",
    order: 1,
    active: true,
  },
  {
    name: "Engagement",
    nameAr: "مكياج خطوبة",
    price: 40,
    description: "A romantic, radiant look for the beginning of forever.",
    descriptionAr: "إطلالة رومانسية ومشرقة لبداية لحظة لا تُنسى.",
    details:
      "An elevated look created around your outfit, features, and engagement celebration.",
    detailsAr:
      "إطلالة متكاملة مصممة لتتناسب مع ملابسكِ وملامحكِ وأجواء حفل الخطوبة.",
    included: [
      "Skin preparation",
      "Full makeup application",
      "Eyelashes",
      "Detailed finishing",
    ],
    includedAr: ["تحضير البشرة", "تطبيق مكياج كامل", "رموش", "لمسات نهائية دقيقة"],
    image: "",
    order: 2,
    active: true,
  },
  {
    name: "Bride",
    nameAr: "مكياج عروس",
    price: 80,
    description: "Timeless beauty for your most unforgettable day.",
    descriptionAr: "جمال خالد لأهم يوم لا يُنسى في حياتكِ.",
    details:
      "A thoughtfully designed bridal look. Message Dima to discuss your wedding date, preferences, and appointment details.",
    detailsAr:
      "إطلالة عروس مصممة بعناية. تواصلي مع ديما لمناقشة موعد الزفاف وتفضيلاتكِ وتفاصيل الحجز.",
    included: [
      "Personalized bridal look",
      "Skin preparation",
      "Eyelashes",
      "Detailed finishing",
    ],
    includedAr: ["إطلالة عروس مخصصة", "تحضير البشرة", "رموش", "لمسات نهائية دقيقة"],
    image: "",
    order: 3,
    active: true,
  },
];
