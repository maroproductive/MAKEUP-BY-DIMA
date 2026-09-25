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
    price: { type: Number, required: true, min: 0 },
    description: str,
    details: str,
    included: [String],
    image: str,
  }),
  portfolio: model("PortfolioItem", {
    ...shared,
    title: { type: String, required: true },
    category: str,
    image: { type: String, required: true },
  }),
  beforeAfter: model("BeforeAfter", {
    ...shared,
    title: { type: String, required: true },
    description: str,
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
  }),
  testimonials: model("Testimonial", {
    ...shared,
    name: { type: String, required: true },
    review: { type: String, required: true },
    image: str,
    rating: { type: Number, min: 1, max: 5 },
  }),
  faqs: model("FAQ", {
    ...shared,
    question: { type: String, required: true },
    answer: { type: String, required: true },
  }),
  settings: model("SiteSettings", {
    key: { type: String, default: "main", unique: true },
    businessName: str,
    bio: str,
    heroHeadline: str,
    heroDescription: str,
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
