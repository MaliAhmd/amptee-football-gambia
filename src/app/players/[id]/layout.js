import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    if (id) {
      const docRef = doc(db, "players", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const player = docSnap.data();
        const fullName = player.fullName || "National Team Player";
        const position = player.position ? `${player.position} - ` : "";
        const desc = player.bio
          ? player.bio.slice(0, 160)
          : `${fullName} is a proud member of the Gambia National Amputee Football Team. View biography, club, and match profile.`;

        return {
          title: `${fullName} | ${position}Gambia Amputee Football`,
          description: desc,
          keywords: [fullName, "Gambia Amputee Football Player", player.position || "Footballer", player.club || "Gambia Club"],
          alternates: {
            canonical: `/players/${id}`,
          },
          openGraph: {
            title: `${fullName} | Gambia National Amputee Team`,
            description: desc,
            url: `/players/${id}`,
            type: "profile",
            images: player.imageUrl ? [{ url: player.imageUrl, alt: fullName }] : ["/logo1.png"],
          },
        };
      }
    }
  } catch (err) {
    console.warn("Player metadata error:", err?.message);
  }

  return {
    title: "Player Profile | Gambia Amputee Football",
    description: "Player profile from the Gambia National Amputee Football Team.",
  };
}

export default function PlayerDetailLayout({ children }) {
  return children;
}
