export const metadata = {
  title: "The Dugout Blog | News, Fixtures & Match Analysis",
  description:
    "Stay updated with the latest news, international tournament fixtures, match results, and inspirational stories from the Gambia Amputee Football Association.",
  keywords: [
    "Gambia amputee football news",
    "African amputee football tournament",
    "WAFF tournament news",
    "Scorpions amputee fixtures",
    "Gambia sports news",
    "Adaptive soccer updates",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "The Dugout Blog | Amputee Football Gambia",
    description:
      "Stay updated with match analyses, news, and exclusive stories from Amputee Football Gambia.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
