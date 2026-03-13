const { defineConfig } = require('@vue/cli-service')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://unicloud-api.taicisou.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new WindiCSSWebpackPlugin()
    ]
  }
})
