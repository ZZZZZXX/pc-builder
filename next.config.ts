import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isProjectPages =
  process.env.GITHUB_ACTIONS === "true" &&
  repoName &&
  !repoName.endsWith(".github.io");
const basePath = isProjectPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
