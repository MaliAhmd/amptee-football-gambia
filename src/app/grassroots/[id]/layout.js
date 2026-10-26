import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    if (id) {
      const docRef = doc(db, "grassroots", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const item = docSnap.data();
        const title = item.title || "Grassroots Initiative";
        const desc = item.excerpt || (item.content ? item.content.slice(0, 160) : "Read about this grassroots program empowering amputee athletes in The Gambia.");

        return {
          title: `${title} | Grassroots Amputee Football Gambia`,
          description: desc,
          keywords: [item.category || "Grassroots", "Amputee Football Gambia", "Youth Adaptive Sports"],
          alternates: {
            canonical: `/grassroots/${id}`,
          },
          openGraph: {
            title: `${title} | Grassroots Amputee Football Gambia`,
            description: desc,
            url: `/grassroots/${id}`,
            type: "article",
            images: item.imageUrl ? [{ url: item.imageUrl, alt: title }] : ["/logo1.png"],
          },
        };
      }
    }
  } catch (err) {
    console.warn("Grassroots metadata error:", err?.message);
  }

  return {
    title: "Grassroots Initiative | Amputee Football Gambia",
    description: "Read about our grassroots amputee sports initiatives in The Gambia.",
  };
}

export default function GrassrootsDetailLayout({ children }) {
  return children;
}
