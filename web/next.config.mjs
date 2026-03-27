import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/crafted-skills",
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
