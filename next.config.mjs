/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    POSTGRES_URL:
      "postgresql://postgres:eoW1gfGdv3pTODzo@54.243.12.78:5432/chatgpt_clone?schema=public",
  },
};

export default nextConfig;
