import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    if (id) {
      const docRef = doc(db, "community", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const item = docSnap.data();
        const title = item.title || "Community Story";
        const desc = item.excerpt || (item.content ? item.content.slice(0, 160) : "Read about this community story empowering amputees in The Gambia.");

        return {
          title: `${title} | Community Amputee Football Gambia`,
          description: desc,
          keywords: [item.category || "Community", "Amputee Football Gambia", "Community Sports"],
          alternates: {
            canonical: `/community/${id}`,
          },
          openGraph: {
            title: `${title} | Community Amputee Football Gambia`,
            description: desc,
            url: `/community/${id}`,
            type: "article",
            images: item.imageUrl ? [{ url: item.imageUrl, alt: title }] : ["/logo1.png"],
          },
        };
      }
    }
  } catch (err) {
    console.warn("Community metadata error:", err?.message);
  }

  return {
    title: "Community Program | Amputee Football Gambia",
    description: "Read about our community outreach programs in The Gambia.",
  };
}

export default function CommunityDetailLayout({ children }) {
  return children;
}
