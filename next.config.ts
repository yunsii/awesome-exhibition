import polishTaggedTemplates from 'unplugin-polish-tagged-templates/webpack'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ref: https://github.com/vercel/next.js/issues/71638
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // ref: https://stackoverflow.com/a/70995196/8335317
      fs: false,
    }

    // ref: https://huggingface.co/docs/transformers.js/tutorials/next#step-2-install-and-configure-transformersjs
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    }

    config.plugins.push(
      polishTaggedTemplates({
        clsTags: ['cls', 'tw'],
      }),
    )

    config.externals = [...config.externals, { canvas: 'canvas' }] // required to make Konva & react-konva work

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
