import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectDB } from "./db";
import { Admin } from "./models";
const cookieName = "dima-session";
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(value);
}
export async function createSession(id: string, version: number) {
  const token = await new SignJWT({ version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setIssuer("dima")
    .setAudience("dima-admin")
    .setExpirationTime("8h")
    .sign(secret());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 28800,
  });
}
export async function getAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
      issuer: "dima",
      audience: "dima-admin",
    });
    await connectDB();
    const admin = await Admin.findById(payload.sub);
    return admin && admin.sessionVersion === payload.version ? admin : null;
  } catch {
    return null;
  }
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  return !!origin && origin === new URL(expected).origin;
}
