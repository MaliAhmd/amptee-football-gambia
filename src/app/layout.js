import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

let rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amptee-football-gambia.vercel.app";
let siteUrl = rawBaseUrl.replace(/\/+$/, "");
if (!siteUrl.startsWith("http://localhost") && !siteUrl.startsWith("http://127.0.0.1")) {
  siteUrl = siteUrl.replace(/^http:\/\//i, "https://");
  if (!siteUrl.startsWith("https://")) {
    siteUrl = `https://${siteUrl}`;
  }
}

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amputee Football Gambia | Official National Association & Team",
    template: "%s | Amputee Football Gambia",
  },
  description:
    "Official portal of the Gambia Amputee Football Association. Explore national team rosters, tournament fixtures, latest match news, grassroots sports programs, and official supporter merchandise.",
  keywords: [
    "Amputee Football Gambia",
    "Gambia Amputee Football Association",
    "Gambia National Amputee Team",
    "African Amputee Football",
    "WAFF",
    "CAFF",
    "World Amputee Football Federation",
    "Para sports Gambia",
    "Adaptive football Africa",
    "Gambian football athletes",
    "Amputee soccer Gambia",
    "Disability sports Gambia",
    "Grassroots football Gambia",
  ],
  authors: [{ name: "Gambia Amputee Football Association", url: siteUrl }],
  creator: "Gambia Amputee Football Association",
  publisher: "Gambia Amputee Football Association",
  applicationName: "Amputee Football Gambia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Amputee Football Gambia | Official National Association & Team",
    description:
      "The official home of Amputee Football in The Gambia. Fixtures, news, athletes, grassroots development, and supporter gear.",
    url: siteUrl,
    siteName: "Gambia Amputee Football Association",
    locale: "en_GM",
    type: "website",
    images: [
      {
        url: "/logo1.png",
        width: 800,
        height: 800,
        alt: "Gambia Amputee Football Association Crest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amputee Football Gambia | Official National Association",
    description:
      "The official home of Amputee Football in The Gambia. Fixtures, news, athlete profiles, and community initiatives.",
    images: ["/logo1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Gambia Amputee Football Association",
      alternateName: ["Amputee Football Gambia", "GAFA", "Scorpions Amputee Team"],
      url: siteUrl,
      logo: `${siteUrl}/logo1.png`,
      image: `${siteUrl}/logo1.png`,
      description:
        "Official national governing body and team for Amputee Football in The Gambia, dedicated to empowering disabled athletes and competing internationally.",
      sport: "Amputee Football",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Banjul",
        addressCountry: "GM",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+220 123 4567",
        contactType: "general inquiries",
        email: "info@amputeefootball.gm",
        areaServed: "GM",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Amputee Football Gambia",
      description: "Official portal of the Gambia Amputee Football Association",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-GM",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
