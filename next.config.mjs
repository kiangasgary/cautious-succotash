/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        http2: false,
        events: false,
        stream: false,
        util: false,
        assert: false,
        url: false,
      };
    }

    if (isServer) {
      config.externals.push({
        'youtube-transcript': 'commonjs youtube-transcript',
      });
    }
    return config;
  },
}

export default nextConfig
