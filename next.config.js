/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // ref: https://stackoverflow.com/a/70995196/8335317
      fs: false,
    }

    config.plugins.push(
      require('unplugin-polish-tagged-templates/webpack').default({
        debug: true,
        cssTags: ['raw'],
      }),
    )

    return config
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

module.exports = nextConfig
