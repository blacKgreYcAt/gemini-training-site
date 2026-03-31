import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 防止構建時的 TypeScript 類型檢查中斷，但仍應修復實際的類型問題
    ignoreBuildErrors: false,
  },
  // 確保靜態生成對動態路由的支持
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;
