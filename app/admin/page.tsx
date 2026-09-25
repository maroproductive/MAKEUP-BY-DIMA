import { getAdmin } from "@/lib/auth";
import { models } from "@/lib/models";
import { defaultSettings } from "@/lib/defaults";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Login } from "@/components/login";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin)
    return (
      <Login
        configured={!!process.env.MONGODB_URI && !!process.env.AUTH_SECRET}
      />
    );
  const entries = await Promise.all(
    Object.entries(models).map(async ([key, model]) => [
      key,
      key === "settings"
        ? {
            ...defaultSettings,
            ...((await model.findOne({ key: "main" }).lean()) || {}),
          }
        : await model.find().sort({ order: 1, _id: 1 }).lean(),
    ]),
  );
  return (
    <AdminDashboard
      initial={JSON.parse(JSON.stringify(Object.fromEntries(entries)))}
    />
  );
}
