export default function manifest() {
  return {
    name: "Gambia Amputee Football Association",
    short_name: "Amputee Football GM",
    description: "Official portal of the Gambia Amputee Football Association. Inspiring inclusion and sporting excellence.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#1B5E20",
    icons: [
      {
        src: "/logo1.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
