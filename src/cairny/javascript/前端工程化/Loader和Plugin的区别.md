---
title: Loader和Plugin的区别
---

`Loader` 和 `Plugin` 是 webpack 中两个核心概念，它们在构建过程中扮演不同的角色：

## Loader 和 Plugin 的区别

### 1. 功能定位
- **Loader**: 主要用于转换模块的源代码，将非 JavaScript 模块（如 CSS、图片、TypeScript 等）转换为 JavaScript 模块
- **Plugin**: 用于执行更广泛的任务，如打包优化、资源管理、环境变量注入等

### 2. 执行时机
- **Loader**: 在模块加载阶段执行，从右到左、从下到上依次执行
- **Plugin**: 贯穿整个 Webpack 构建生命周期，在特定的时机执行

### 3. 使用方式
- **Loader**: 通过 `module.rules` 配置，主要处理 `test`、use 等属性
- **Plugin**: 通过 plugins 数组配置，需要实例化插件

## 编写 Loader 的思路

### 1. 基本结构
```javascript
// 同步 loader
module.exports = function(source) {
  // 处理 source
  return processedSource;
};

// 异步 loader
module.exports = function(source) {
  const callback = this.async();
  // 异步处理
  callback(null, processedSource);
};
```

### 2. 关键要素
- 接收源代码作为输入
- 返回处理后的代码
- 可以通过 `this` 访问 Webpack 提供的 API
- 支持同步和异步处理

## 编写 Plugin 的思路

### 1. 基本结构
```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 插件逻辑
    });
  }
}

module.exports = MyPlugin;
```

### 2. 关键要素
- 需要实现 `apply` 方法
- 通过 compiler hooks 监听构建事件
- 可以访问和修改 compilation 对象
- 可以在构建流程的不同阶段执行自定义逻辑

### 3. 常用 hooks
- `compile`: 编译开始前
- `emit`: 生成资源到 output 目录之前
- `done`: 编译完成之后