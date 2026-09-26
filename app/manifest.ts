import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Makeup by Dima",
    short_name: "Dima Makeup",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5ef",
    theme_color: "#f8f5ef",
    icons: [
      {
        src: "/makeup-by-dima-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
