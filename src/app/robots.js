export default function robots() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amptee-football-gambia.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/editor",
          "/editor/*",
          "/coach",
          "/coach/*",
          "/api",
          "/api/*",
          "/change-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
