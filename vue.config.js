const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const webpack = require("webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: "assets",
  css: {
    loaderOptions: {
      // 给 scss 文件注入全局变量
      scss: {
        additionalData: `@import "@src/assets/theme-chalk/theme.scss";`
      }
    }
  },
  // 使用 runtime 时 vue 文件
  runtimeCompiler: true,
  // 扩展 webpack 配置，使 packages 加入编译
  configureWebpack: {
    resolve: {
      alias: {
        "@src": resolve("src")
      },
      extensions: [".tsx", ".ts", ".js", ".vue"]
    },
    // output: {
    //   // 直接暴露对象，减少 default 嵌套
    //   libraryExport: "default"
    // },
    plugins: [
      // 全局注入 $
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new MonacoWebpackPlugin({
        // languages: ["javascript", "css", "html", "json"],
        // features: ["coreCommands", "find"]
      })
    ]
  },
  productionSourceMap: false
  // parallel: require("os").cpus().length > 1
});
