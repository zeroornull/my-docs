---
title: webpack 5 升级点
---

##### 一、持久化缓存（Persistent Caching）
**核心改进：** 内置了持久化缓存机制，显著提升构建速度。
* **原理：** 默认将构建结果缓存到文件系统（node_modules/.cache/webpack），二次构建时跳过未变更
* **配置方式：**
```javascript
module.exports = {
  cache: {
    type: 'filesystem', // 启用文件系统缓存
    buildDependencies: {
      config: [__filename], // 当配置文件变更时自动失效缓存
    },
  },
};
```
* **效果：** 冷启动构建速度提升可达 60%+，尤其适合大型项目。


##### 二、长期缓存优化（Long Term Caching）
1. **确定的 Chunk ID 与 Module ID**
* 旧版问题：默认的数字 ID 会导致文件内容不变但哈希变化（因插入新模块导致 ID 偏移）。
* 解决方案：采用基于内容哈希的 ID 算法（deterministic），确保未变更的模块哈希稳定。
```javascript
optimization: {
  chunkIds: 'deterministic', // 默认值
  moduleIds: 'deterministic',
}
```
2. **真实的 contenthash**
* 修复旧版 [contenthash] 因内部依赖关系计算不准确的问题，确保仅当文件内容变化时哈希才改变。

##### 三、资源模块（Asset Modules）
**取代旧版 Loader（如 file-loader/url-loader）** ，原生支持资源文件处理：
* **四种类型：**
```javascript
module: {
  rules: [
    {
      test: /\.png/,
      type: 'asset/resource', // 替代 file-loader（发射文件）
      generator: { filename: 'images/[hash][ext]' }
    },
    {
      test: /\.svg/,
      type: 'asset/inline',    // 替代 url-loader（DataURL）
    },
    {
      test: /\.txt/,
      type: 'asset/source',    // 替代 raw-loader
    },
    {
      test: /\.jpg/,
      type: 'asset',           // 自动选择（根据大小阈值）
      parser: { dataUrlCondition: { maxSize: 4 * 1024 } }
    }
  ]
}
```

##### 四、模块联邦（Module Federation）
**革命性功能：** 实现微前端或多应用间的模块共享。
* **核心概念：**
  * **Host：** 消费其他应用模块的主应用。
  * **Remote：** 暴露模块给其他应用的应用。
* 示例配置：
```javascript
// Remote 应用配置（暴露模块）
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: { './Button': './src/Button.js' },
});

// Host 应用配置（消费模块）
new ModuleFederationPlugin({
  remotes: { app1: 'app1@http://cdn.com/remoteEntry.js' },
});
```
* **优势：** 运行时动态加载，共享依赖避免重复打包。

##### 五、Tree Shaking 增强
1. 嵌套的 export 优化
   * 支持深度分析嵌套的 export（如 export { foo } from './bar'）。
2. innerGraph 分析
   * 识别模块内部未被使用的导出（即使被其他模块引用但最终未使用）。
3. CommonJS Tree Shaking 实验性支持
    * 通过 optimization.innerGraph: true 尝试处理 CommonJS 模块。

##### 六、构建优化（Build Improvements）
1. 移除 Node.js Polyfill
    * 默认不再自动注入 polyfill（如 crypto），需手动通过 resolve.fallback 配置。
```javascript
resolve: {
  fallback: { crypto: require.resolve('crypto-browserify') }
}
```
2. 代码生成优化
   * 生成更高效的运行时代码，减少打包体积。
3. eval 模式下的命名模块
    * 开发时 eval 源码映射显示真实文件名而非数字 ID。


##### 七、其他重要改进
1. WebAssembly 支持
   * 原生支持 WASM 模块导入（无需 wasm-loader）。
```javascript
const wasm = await import('./module.wasm');
```
2. Top Level Await（实验性）
  * 允许在模块顶层使用 await。
3. 性能分析增强
   * 更详细的 stats 输出和插件性能追踪。

##### 八、破坏性变更（Breaking Changes）
1. 不再支持 require.ensure
   * 必须使用 import() 动态导入。
2. process.env 默认未定义
   * 需通过 DefinePlugin 手动注入。
3. __dirname/__filename 行为变化
   * 在 ESM 模式下返回 / 或文件名（非绝对路径）。


##### 九、迁移建议
1. 逐步升级：先解决破坏性变更，再启用新特性。
2. 性能对比：使用 webpack-bundle-analyzer 验证 Tree Shaking 和缓存效果。
3. 检查插件兼容性：确保常用插件（如 HtmlWebpackPlugin）升级到支持 Webpack 5 的版本。

