---
title: Node在使用es module时必须加上文件扩展名
---

这是一个很好的问题。Node.js 在使用 ES modules 时要求文件扩展名的原因有几个，让我详细解释一下：

## 1. 模块解析机制的差异

在 Node.js 中，CommonJS 和 ES modules 使用不同的模块解析机制：

### CommonJS 的解析方式
```javascript
// 使用 CommonJS 时，Node.js 会自动尝试多种扩展名
const myModule = require('./myModule');
// Node.js 会依次尝试：
// ./myModule.js
// ./myModule.json
// ./myModule.node
```

### ES modules 的解析方式
```javascript
// 使用 ES modules 时，必须明确指定文件路径
import myModule from './myModule.js';  // ✅ 正确
// import myModule from './myModule';   // ❌ 错误，会抛出 ERR_MODULE_NOT_FOUND
```

## 2. 规范一致性

ES modules 遵循 Web 标准，浏览器中的 ES modules 也要求明确的文件路径：

```javascript
// 在浏览器中，这样是无法工作的
import { something } from './module';

// 必须明确指定扩展名
import { something } from './module.js';
```

## 3. 性能考虑

明确的文件扩展名可以提高模块解析的性能：

```javascript
// Node.js 不需要猜测文件类型
import utils from './utils.js';    // 明确是 JavaScript 文件
import data from './data.json';    // 明确是 JSON 文件
import styles from './style.css';  // 明确是 CSS 文件
```

## 4. 避免歧义

没有扩展名可能导致歧义和安全问题：

```javascript
// 假设目录结构如下：
// - lib.js
// - lib.json

// 这种写法不明确 Node.js 应该加载哪个文件
// import lib from './lib';  // 不确定是 lib.js 还是 lib.json

// 明确的写法避免了歧义
import lib from './lib.js';   // 明确加载 JavaScript 版本
import libData from './lib.json'; // 明确加载 JSON 版本
```

## 5. 解决方案

### 方案一：使用完整的文件扩展名
```javascript
// 推荐做法
import { helper } from './utils.js';
import { config } from './config.json';
import('./dynamic-module.js');  // 动态导入也需要扩展名
```

### 方案二：使用 package.json 的 exports 字段
```json
{
  "name": "my-package",
  "exports": {
    ".": "./index.js",
    "./utils": "./src/utils/index.js",
    "./components": "./src/components/index.js"
  }
}
```

然后可以这样导入：
```javascript
import { helper } from 'my-package/utils';  // 不需要扩展名
```

### 方案三：使用 import maps（实验性）
```json
{
  "imports": {
    "utils": "./src/utils/index.js",
    "components/": "./src/components/"
  }
}
```

## 实际示例

让我通过一个具体例子来说明这个问题：

```javascript
// 文件结构：
// src/
//   ├── main.js
//   ├── utils.js
//   └── config.json

// ❌ 错误的 ES module 导入方式
// import { formatDate } from './utils';      // 缺少 .js 扩展名
// import config from './config';             // 缺少 .json 扩展名

// ✅ 正确的 ES module 导入方式
import { formatDate } from './utils.js';
import config from './config.json';

// 甚至可以混用（虽然不推荐）
import pkg from '../package.json';
```

总结来说，Node.js 要求 ES modules 使用明确的文件扩展名主要是为了：
1. 与 Web 标准保持一致
2. 提高模块解析性能
3. 避免文件解析歧义
4. 确保代码在不同环境下的可移植性