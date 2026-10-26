import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap() {
  let rawBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://amputee-football-gambia.vercel.app").replace(/amptee-football-gambia/gi, "amputee-football-gambia");
  let baseUrl = rawBaseUrl.replace(/\/+$/, "");
  if (!baseUrl.startsWith("http://localhost") && !baseUrl.startsWith("http://127.0.0.1")) {
    baseUrl = baseUrl.replace(/^http:\/\//i, "https://");
    if (!baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }
  }

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/grassroots`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let dynamicRoutes = [];
  try {
    // 1. Articles / Blog
    const articlesSnap = await getDocs(collection(db, "articles"));
    articlesSnap.forEach((doc) => {
      const data = doc.data();
      dynamicRoutes.push({
        url: `${baseUrl}/blog/${doc.id}`,
        lastModified: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // 2. Players
    const playersSnap = await getDocs(collection(db, "players"));
    playersSnap.forEach((doc) => {
      dynamicRoutes.push({
        url: `${baseUrl}/players/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

    // 3. Grassroots
    const grassrootsSnap = await getDocs(collection(db, "grassroots"));
    grassrootsSnap.forEach((doc) => {
      dynamicRoutes.push({
        url: `${baseUrl}/grassroots/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    // 4. Community
    const communitySnap = await getDocs(collection(db, "community"));
    communitySnap.forEach((doc) => {
      dynamicRoutes.push({
        url: `${baseUrl}/community/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  } catch (err) {
    // Graceful fallback during build or network restrictions
    console.warn("Dynamic sitemap generation error:", err?.message);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
