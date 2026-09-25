import mongoose from "mongoose";
const globalDb = globalThis as unknown as {
  mongoPromise?: Promise<typeof mongoose>;
};
export async function connectDB() {
  if (!process.env.MONGODB_URI)
    throw new Error(
      "MongoDB is not configured. Add MONGODB_URI to your environment.",
    );
  if (!globalDb.mongoPromise)
    globalDb.mongoPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        globalDb.mongoPromise = undefined;
        throw error;
      });
  return globalDb.mongoPromise;
}
