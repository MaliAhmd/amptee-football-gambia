import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    if (id) {
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const article = docSnap.data();
        const title = article.title || "Latest Article";
        const desc = article.excerpt || (article.content ? article.content.slice(0, 160) : "Read this article from Amputee Football Gambia.");

        return {
          title: `${title} | Amputee Football Gambia`,
          description: desc,
          keywords: [article.category || "Football", "Gambia Amputee Football", "African football news"],
          alternates: {
            canonical: `/blog/${id}`,
          },
          openGraph: {
            title: `${title} | Amputee Football Gambia`,
            description: desc,
            url: `/blog/${id}`,
            type: "article",
            publishedTime: article.createdAt?.seconds ? new Date(article.createdAt.seconds * 1000).toISOString() : undefined,
            images: article.imageUrl ? [{ url: article.imageUrl, alt: title }] : ["/logo1.png"],
          },
          twitter: {
            card: "summary_large_image",
            title: `${title} | Amputee Football Gambia`,
            description: desc,
            images: article.imageUrl ? [article.imageUrl] : ["/logo1.png"],
          },
        };
      }
    }
  } catch (err) {
    console.warn("Blog metadata error:", err?.message);
  }

  return {
    title: "Article | Amputee Football Gambia",
    description: "Read the latest update from Amputee Football Gambia.",
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}
