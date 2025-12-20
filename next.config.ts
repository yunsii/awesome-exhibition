import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ref: https://github.com/vercel/next.js/issues/71638
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  // Turbopack configuration for Next.js 16+
  // Note: Some webpack config options are not yet supported in Turbopack
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  turbopack: {
    resolveAlias: {
      // ref: https://stackoverflow.com/a/70995196/8335317
      'fs/promises': { browser: './empty.ts' },
      'fs': { browser: './empty.ts' },
      'url': { browser: './empty.ts' },
    },
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
