import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { connectDB } from "@/lib/db";
import { Admin, LoginAttempt } from "@/lib/models";
import { createSession, clearSession, validOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!validOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  try {
    const { email, password } = await request.json();
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length > 254 ||
      password.length > 256
    )
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    await connectDB();
    const key = createHash("sha256")
      .update(email.trim().toLowerCase())
      .digest("hex");
    await LoginAttempt.deleteOne({ key, expiresAt: { $lte: new Date() } });
    const attempt = await LoginAttempt.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
      },
      { upsert: true, new: true },
    );
    if (attempt.count > 10)
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    const hash =
      admin?.passwordHash ||
      "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";
    const match = await bcrypt.compare(password, hash);
    if (!admin || !match)
      return NextResponse.json(
        { error: "Email or password is incorrect." },
        { status: 401 },
      );
    await createSession(String(admin._id), admin.sessionVersion);
    await LoginAttempt.deleteOne({ key });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Sign-in is unavailable. Check your database and authentication configuration.",
      },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!validOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  await clearSession();
  return NextResponse.json({ ok: true });
}
