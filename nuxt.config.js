const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  /*
  ** Headers of the page
  */
  cache: {
    max: 100,
    maxAge: 1000 * 60 * 15
  },
  head: {
    title: '恒安金链',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_778712_t1kfhd6zxaa.css' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', defer: 'defer' },
      { src: '/js/strophe/strophe.min.js', defer: 'defer' },
      { src: "/js/charting_library/charting_library.min.js", defer: 'defer' },
      { src: "/js/datafeeds/udf/dist/bundle.js", defer: 'defer' },
      { src: "/js/datafeeds/udf/dist/polyfills.js", defer: 'defer' },
      { src: "//at.alicdn.com/t/font_778712_60zd5adumq8.js", defer: 'defer' }
    ]
  },
  router: {
    middleware: ['device', 'urlRedirect', 'socket']
  },
  /*
  ** Global CSS
  */
  css: ['element-ui/lib/theme-chalk/index.css', '@/assets/css/normalize.scss', '@/assets/css/index.scss', 'element-ui/lib/theme-chalk/display.css'],
  /*
  ** Add axios globally
  */
  plugins: [
    { src: '~plugins/element-ui', ssr: true },
    '~plugins/i18n.js',
    { src: '~/plugins/vuex-persistedstate.js', ssr: false },
    '~plugins/initLang.js',
    { src: '~plugins/util.js', ssr: false },
    { src: '~plugins/os.js', ssr: false },
    '~plugins/vue-clipboard2.js',
    '~plugins/filter.js',
    '~plugins/components.js',
    { src: '@/directives/index.js' },
    { src: '~plugins/vue-socket.js', ssr: false },
    { src: '~plugins/vue-grid-layout.js', ssr: false }
  ],
  env: {
    __ENV: process.env.__ENV
  },
  dev: {
  },
  build: {
    vendor: ['axios', 'element-ui'],
    extractCSS: { allChunks: true },
    styleResources: {
      scss: ['./assets/css/util.scss', './assets/css/variables/light.scss']
    },
    extend(config, { isDev, isClient }) {
      const vueLoader = config.module.rules.find((rule) => rule.loader === 'vue-loader')
      vueLoader.options.loaders.sass = 'vue-style-loader!css-loader!sass-loader'
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      /*
      ** Run ESLINT on save
      */
    }
  }
}
