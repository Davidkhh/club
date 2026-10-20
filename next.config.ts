import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'fs.getcourse.ru' }, { protocol: 'https', hostname: 'fs-thb01.getcourse.ru' }, { protocol: 'https', hostname: 'fs-thb02.getcourse.ru' }, { protocol: 'https', hostname: 'fs-thb03.getcourse.ru' }] }
};
export default nextConfig;
