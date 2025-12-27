---
title: webpack的热更新
---

# Webpack 热更新 (Hot Module Replacement)

## 什么是热更新

Webpack 的热更新（Hot Module Replacement，HMR）是一种在应用程序运行过程中替换、添加或删除模块的功能，而无需完全重新加载整个页面。这使得开发体验更加流畅，因为：

- 保持应用程序状态不丢失
- 只更新变更的部分，节省时间
- 在浏览器控制台中保留错误堆栈

## 工作原理

1. **Webpack Dev Server** 启动一个本地服务器
2. **WebSocket 连接** 建立客户端与服务器之间的通信
3. **文件监听** Webpack 监听文件变化
4. **增量编译** 只编译修改的模块
5. **热更新传输** 将更新的模块通过 WebSocket 发送给客户端
6. **模块替换** 客户端接收更新并替换对应模块

## 配置方式

### 基础配置

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true, // 启用热更新
    open: true,
    port: 3000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // webpack 5 中通常不需要手动添加
  ]
};
```

### 手动接受模块更新

```javascript
// 在入口文件中
if (module.hot) {
  module.hot.accept('./component', () => {
    // 当 ./component 模块更新时执行的逻辑
    console.log('Component updated');
  });
}
```

## React 中的热更新

使用 `react-hot-loader` 或 `@pmmmwh/react-refresh-webpack-plugin` 实现 React 组件的热更新：

```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  plugins: [
    new ReactRefreshWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-refresh/babel']
            }
          }
        ]
      }
    ]
  }
};
```

## 优势

- **保持状态**：应用状态不会因为代码更新而丢失
- **快速反馈**：无需等待完整页面刷新
- **调试友好**：浏览器调试器中的断点和调用栈得以保留
- **提高效率**：显著加快开发迭代速度

## 注意事项

- 热更新仅在开发环境中使用
- 需要正确处理模块的接受和处置逻辑
- 某些代码变更仍需要完全刷新页面
- 复杂的模块依赖关系可能影响热更新效果