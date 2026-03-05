import type { MetadataRoute } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "dinotrack"; // GitHub Pages path → quyenvu04092000.github.io/dinimoney

const basePath = isProd ? `/${repoName}` : "";

const withBasePath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dino Money",
    short_name: "App",
    description: "Mobile-first PWA for managing your money.",
    start_url: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: withBasePath("/icons/icon-48x48.png"),
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-72x72.png"),
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-96x96.png"),
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-128x128.png"),
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-144x144.png"),
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-152x152.png"),
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-192x192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-256x256.png"),
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-384x384.png"),
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-512x512.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
