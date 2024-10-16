import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["@sqlite"] = "./database.db";
    }
    return config;
  },
  images: {
    domains: ["generatech-images.s3.us-west-2.amazonaws.com"],
  },
};

export default nextConfig;
