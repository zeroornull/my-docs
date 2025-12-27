---
title： webpack treeShaking机制的原理
---

# Webpack Tree Shaking 机制原理详解

## 1. Tree Shaking 基本概念

Tree Shaking 是一种通过消除未使用代码（dead code）来优化打包体积的技术。它基于 ES6 模块系统的静态结构特性，在编译时分析并移除未被引用的代码。

## 2. 工作原理

### 静态分析阶段
- **ES6 模块的静态特性**：ES6 模块的导入导出语句在编译时就能确定，不依赖运行时
- **构建依赖图**：webpack 通过 `import` 和 `export` 语句构建完整的模块依赖关系图
- **标记使用情况**：分析每个导出的模块是否被实际使用

### 代码标记阶段
- **HarmonyExportSpecifierDependency**：标记具体的导出项
- **HarmonyImportSpecifierDependency**：标记导入的依赖项
- **副作用分析**：识别模块是否有副作用（side effects）

### 代码删除阶段
- 移除未被标记的导出代码
- 删除无用的导入语句
- 清理空的模块结构

## 3. 实现细节

### 模块系统要求
```javascript
// 支持的写法（可被 tree shaking）
export const utils = { ... };
export function helper() { ... }
import { utils } from './module';

// 不利于 tree shaking 的写法
export default { utils, helper };
import module from './module';
```

### Side Effects 配置
```javascript
// package.json
{
  "sideEffects": false // 或指定有副作用的文件
}
```

## 4. 触发条件

- 使用 ES6 的 `import/export` 语法
- 在 `production` 模式下或明确配置 `optimization.usedExports`
- 正确配置 `sideEffects` 属性
- 使用支持 tree shaking 的工具链（如 uglify-js-webpack-plugin）

## 5. 限制与注意事项

- **不能处理动态导入**：运行时才能确定的依赖无法分析
- **CommonJS 模块**：require 语法无法进行静态分析
- **副作用代码**：可能被误删的有副作用但未导出的代码
- **第三方库支持**：需要库本身支持 ES 模块格式

Tree Shaking 本质上是利用 ES6 模块的静态特性，通过静态分析标记使用情况，最终在压缩阶段移除未使用的代码，从而减小最终打包文件的体积。