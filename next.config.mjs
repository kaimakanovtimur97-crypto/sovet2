/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "sovet-nvrsk.ru" }],
        destination: "https://www.sovet-nvrsk.ru/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "sovet-novoross.ru" }],
        destination: "https://www.sovet-nvrsk.ru/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sovet-novoross.ru" }],
        destination: "https://www.sovet-nvrsk.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
