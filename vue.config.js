// const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const SpritesmithPlugin = require('webpack-spritesmith')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  baseUrl: isProduction ? '/themes/aicall/' : '/',
  outputDir: 'aicall',
  productionSourceMap: false,
  devServer: {
    proxy: 'http://192.168.1.216',
    // proxy: 'https://ai.emic.com.cn',
    // proxy: 'https://47.93.197.209',
    historyApiFallback: {
      rewrites: [
        {
          from: /\/admin/,
          to: '/admin.html'
        },
        {
          from: /\//,
          to: '/index.html'
        }
      ]
    }
  },
  pages: {
    index: {
      entry: 'src/pages/AICall/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '智能外呼语音平台'
    },
    admin: {
      entry: 'src/pages/Admin/main.js',
      template: 'public/index.html',
      filename: 'admin.html',
      title: '运营平台管理页面'
    }
  },
  configureWebpack: (config) => {
    const sprites = ['statistics', 'menu']
    const spritesmithPlugins = sprites.map((sprite) => {
      return new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, `src/assets/icons/${sprite}`),
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, `src/assets/sprite/${sprite}.png`),
          css: path.resolve(__dirname, `src/assets/css/sprite/${sprite}.scss`)
        },
        apiOptions: {
          cssImageRef: `~@/assets/sprite/${sprite}.png`
        },
        retina: '@2x',
        spritesmithOptions: {
          algorithm: 'top-down',
          padding: 5
        }
      })
    })

    return {
      resolve: {
        modules: [
          'assets/sprite'
        ]
      },
      plugins: spritesmithPlugins
      // optimization: {
      //   splitChunks: {
      //     minSize: 10000,
      //     maxSize: 300000
      //   }
      // }
    }
    // opts.externals = {
    //   'vue': 'Vue',
    //   'vuex': 'Vuex',
    //   'vue-router': 'VueRouter',
    //   'axios': 'axios'
    // }
    // if (isProduction) {
    //   opts.plugins = [
    //     new CompressionPlugin({
    //       test: /\.js|.css/,
    //       threshold: 10240
    //     })
    //   ]
    // }
    // return opts
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    if (isProduction) {
      const TerserPlugin = require('terser-webpack-plugin')
      const terser = require('@vue/cli-service/lib/config/terserOptions.js')
      const opts = terser({
        productionSourceMap: false
      })
      opts.terserOptions.compress.drop_console = true
      opts.terserOptions.compress.pure_funcs = ['console.log']
      config.optimization.minimizer([new TerserPlugin(opts)])
    }
  }
  // chainWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // config
  //     //   .plugin('webpack-bundle-analyzer')
  //     //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  //   }
  // },
}
