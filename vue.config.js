const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    https: true,
  },
  // resolve: {
  //   alias: {
  //     'mixin': path.resolve(__dirname, "src/plugin")
  //   }
  // },
  publicPath: process.env.NODE_ENV === 'production' ? '/tripByselfView/' : '/',
  chainWebpack(config) {
    // SVG sprite exclude
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    // SVG sprite include
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end(); (


        // 设置别名
        config.resolve.alias.set("mixin", path.resolve(__dirname, 'src/plugin'))).set("@", path.resolve(__dirname, 'src')).end()

  }
  // webpack3 写法
  // resolve: {
  //   alias: {
  //     'mixin': path.resolve(__dirname, 'src/plugin'),
  //     '@': path.resolve(__dirname, 'src')
  //   }
  // }
}
