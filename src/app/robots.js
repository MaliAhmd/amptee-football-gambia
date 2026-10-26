export default function robots() {
  let rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amputee-football-gambia.vercel.app";
  let baseUrl = rawBaseUrl.replace(/\/+$/, "");
  if (!baseUrl.startsWith("http://localhost") && !baseUrl.startsWith("http://127.0.0.1")) {
    baseUrl = baseUrl.replace(/^http:\/\//i, "https://");
    if (!baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }
  }

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
