import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdmin, validOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!validOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!(await getAdmin()))
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  if (!process.env.CLOUDINARY_API_SECRET)
    return NextResponse.json(
      { error: "Configure Cloudinary before uploading." },
      { status: 503 },
    );
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      return NextResponse.json(
        { error: "Choose a JPG, PNG, or WebP image under 4 MB." },
        { status: 400 },
      );
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "makeup-by-dima",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
        transformation: [
          { width: 2400, height: 2400, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
    );
    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Check Cloudinary configuration and try again." },
      { status: 500 },
    );
  }
}
