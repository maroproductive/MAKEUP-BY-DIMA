import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PublicSite } from "@/components/public-site";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    title: settings.businessName,
    description: settings.heroDescription || settings.bio,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.businessName,
      description: settings.heroDescription || settings.bio,
    },
  };
}
export default async function Home() {
  const content = await getContent();
  return <PublicSite {...content} />;
}
