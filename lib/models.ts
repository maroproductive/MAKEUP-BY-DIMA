import mongoose, { Schema, type SchemaDefinition } from "mongoose";
const shared = {
  order: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true },
};
const str = { type: String, default: "" };
function model(name: string, fields: SchemaDefinition) {
  return (
    mongoose.models[name] ||
    mongoose.model(name, new Schema(fields, { timestamps: true }))
  );
}
export const models = {
  packages: model("Package", {
    ...shared,
    name: { type: String, required: true },
    nameAr: str,
    price: { type: Number, required: true, min: 0 },
    description: str,
    descriptionAr: str,
    details: str,
    detailsAr: str,
    included: [String],
    includedAr: [String],
    image: str,
  }),
  portfolio: model("PortfolioItem", {
    ...shared,
    title: { type: String, required: true },
    titleAr: str,
    category: str,
    categoryAr: str,
    image: { type: String, required: true },
  }),
  beforeAfter: model("BeforeAfter", {
    ...shared,
    title: { type: String, required: true },
    titleAr: str,
    description: str,
    descriptionAr: str,
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
  }),
  testimonials: model("Testimonial", {
    ...shared,
    name: { type: String, required: true },
    nameAr: str,
    review: { type: String, required: true },
    reviewAr: str,
    image: str,
    rating: { type: Number, min: 1, max: 5 },
  }),
  faqs: model("FAQ", {
    ...shared,
    question: { type: String, required: true },
    questionAr: str,
    answer: { type: String, required: true },
    answerAr: str,
  }),
  settings: model("SiteSettings", {
    key: { type: String, default: "main", unique: true },
    businessName: str,
    businessNameAr: str,
    bio: str,
    bioAr: str,
    heroHeadline: str,
    heroHeadlineAr: str,
    heroDescription: str,
    heroDescriptionAr: str,
    heroImage: str,
    whatsapp: str,
    instagramUrl: str,
    mapsUrl: str,
    footerUrl: str,
  }),
};
export const Admin = model("Admin", {
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  sessionVersion: { type: Number, default: 0 },
});
const attemptSchema = new Schema(
  {
    key: { type: String, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, expires: 0 },
  },
  { timestamps: true },
);
export const LoginAttempt =
  mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", attemptSchema);
