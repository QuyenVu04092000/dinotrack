/**
 * Base path for GitHub Pages (e.g. /dinotrack). Empty in dev.
 * Use for Image src and url() so assets load at quyenvu04092000.github.io/dinotrack/...
 */
const isProd = process.env.NODE_ENV === "production";
const repoName = "dinotrack"; // GitHub Pages path → quyenvu04092000.github.io/dinimoney

const basePath = isProd ? `/${repoName}` : "";

/** Returns path with base path for production (e.g. /dinotrack/images/background.png). */
export function imagePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}
