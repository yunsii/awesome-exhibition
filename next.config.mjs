import polishTaggedTemplates from 'unplugin-polish-tagged-templates/webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // ref: https://stackoverflow.com/a/70995196/8335317
      fs: false,
    }

    config.plugins.push(
      polishTaggedTemplates({
        cssTags: ['cls', 'tw'],
      }),
    )

    return config
  },
  // ref: https://webcontainers.io/guides/configuring-headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
  modularizeImports: {
    'antd': {
      transform: 'antd/lib/{{ kebabCase member }}',
    },
    'lodash-es': {
      transform: 'lodash-es/{{member}}',
    },
  },
}

export default nextConfig
