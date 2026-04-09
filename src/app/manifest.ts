import type { MetadataRoute } from "next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: `${siteUrl}/`,
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    lang: "zh-CN",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
