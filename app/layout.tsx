import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Pwa } from "@/components/pwa";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Makeup by Dima | Beautifully You",
    template: "%s | Makeup by Dima",
  },
  description:
    "Thoughtfully created makeup for everyday moments, engagements, and your wedding day. Discover Makeup by Dima.",
  applicationName: "Makeup by Dima",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dima Makeup",
  },
  icons: {
    icon: "/makeup-by-dima-mark.svg",
    apple: "/makeup-by-dima-mark.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Makeup by Dima",
    title: "Makeup by Dima",
    description: "Your beauty, beautifully enhanced.",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f5ef",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Pwa />
      </body>
    </html>
  );
}
