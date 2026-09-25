import { connectDB } from "../lib/db";
import { Admin, models } from "../lib/models";
import { defaultSettings, initialPackages } from "../lib/defaults";
import mongoose from "mongoose";
async function seed() {
  if (
    !process.env.ADMIN_EMAIL ||
    !/^\$2[aby]\$\d{2}\$/.test(process.env.ADMIN_PASSWORD_HASH || "")
  )
    throw new Error("Set ADMIN_EMAIL and a bcrypt ADMIN_PASSWORD_HASH first.");
  await connectDB();
  await Admin.updateOne(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    {
      $setOnInsert: {
        passwordHash: process.env.ADMIN_PASSWORD_HASH,
        sessionVersion: 0,
      },
    },
    { upsert: true },
  );
  await models.settings.updateOne(
    { key: "main" },
    { $setOnInsert: defaultSettings },
    { upsert: true },
  );
  if ((await models.packages.countDocuments()) === 0)
    await models.packages.insertMany(initialPackages);
  console.log(
    "Seed complete. Existing content and credentials were preserved.",
  );
}
seed()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
