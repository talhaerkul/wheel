import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["@sqlite"] = "./database.db";
    }
    return config;
  },
};

export default nextConfig;
