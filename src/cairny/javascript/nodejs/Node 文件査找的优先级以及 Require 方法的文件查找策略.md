---
title: Node 文件査找的优先级以及 Require 方法的文件查找策略
---

Node.js 的模块查找机制是其核心特性之一，让我详细解释文件查找的优先级和 `require` 方法的查找策略。

## 1. 模块类型

### 核心模块（Core Modules）
```javascript
// Node.js 内置模块，优先级最高
const fs = require('fs');
const path = require('path');
const http = require('http');
const util = require('util');

// 核心模块可以直接通过名称引用，无需路径
console.log(Object.keys(require('module').builtinModules));
```

### 文件模块（File Modules）
```javascript
// 相对路径引用
const myModule = require('./myModule');
const utils = require('../utils/helper');

// 绝对路径引用
const config = require('/home/user/project/config');

// 注意：相对路径必须以 ./ 或 ../ 开头
// const wrong = require('myModule'); // 这会被当作核心模块或 node_modules 查找
```

### 目录模块（Folder Modules）
```javascript
// 当 require 指向目录时，Node.js 会查找 package.json 或 index 文件
const myPackage = require('./my-directory');
// 等同于 require('./my-directory/index.js')
```

## 2. require 查找策略详解

### 查找顺序流程图
```javascript
// require(X) from module at path Y 的查找顺序：

function requireModule(X, Y) {
  // 1. 如果 X 是核心模块，直接返回
  if (isCoreModule(X)) {
    return coreModule(X);
  }
  
  // 2. 如果 X 以 ./, ../, / 开头（相对或绝对路径）
  if (isRelativeOrAbsolutePath(X)) {
    // 解析实际路径
    const resolvedPath = resolvePath(X, Y);
    
    // 按优先级查找文件
    const file = findFile(resolvedPath);
    if (file) return file;
    
    // 查找目录
    const directory = findDirectory(resolvedPath);
    if (directory) return directory;
  }
  
  // 3. 查找 node_modules 目录
  return findInNodeModules(X, Y);
}
```

## 3. 文件查找优先级

### 具体文件查找顺序
```javascript
// 当 require('./myModule') 时的查找顺序：

// 1. 查找确切文件名
// ./myModule (直接查找这个文件)

// 2. 添加 .js 扩展名
// ./myModule.js

// 3. 添加 .json 扩展名
// ./myModule.json

// 4. 添加 .node 扩展名（编译后的 C++ 插件）
// ./myModule.node

// 示例演示
console.log('当前目录文件结构:');
console.log(`
myModule
myModule.js
myModule.json
myModule.node
`);

// Node.js 会按顺序查找，找到第一个就停止
const module = require('./myModule');
// 如果存在 myModule 文件（无扩展名），会优先加载它
```

### 目录模块查找顺序
```javascript
// 当 require('./myDirectory') 时的查找顺序：

// 1. 查找 package.json 文件
// ./myDirectory/package.json
// 读取 "main" 字段指定的入口文件

// 2. 如果没有 package.json 或没有 main 字段，查找 index 文件
// ./myDirectory/index.js
// ./myDirectory/index.json
// ./myDirectory/index.node

// 示例 package.json
const packageJson = {
  "name": "my-package",
  "version": "1.0.0",
  "main": "lib/entry.js",  // 指定入口文件
  "exports": {             // ES Modules 导出配置 (Node.js 12+)
    ".": "./lib/entry.js",
    "./feature": "./lib/feature.js"
  }
};
```

## 4. node_modules 查找策略

### 逐级向上查找
```javascript
// 当 require('lodash') 时的查找顺序：

function findInNodeModules(moduleName, currentPath) {
  /*
  假设当前文件在 /home/user/project/src/utils.js
  查找顺序如下：
  
  1. /home/user/project/src/node_modules/lodash/
  2. /home/user/project/node_modules/lodash/
  3. /home/user/node_modules/lodash/
  4. /home/node_modules/lodash/
  5. /node_modules/lodash/
  
  直到找到或到达文件系统根目录
  */
}

// 实际示例
console.log('模块查找路径:');
console.log(module.paths);
// 输出类似：
// [
//   '/home/user/project/src/node_modules',
//   '/home/user/project/node_modules',
//   '/home/user/node_modules',
//   '/home/node_modules',
//   '/node_modules'
// ]
```

### 嵌套 node_modules
```javascript
// 项目结构示例
/*
project/
├── node_modules/
│   ├── express/
│   │   └── package.json
│   └── lodash/
│       └── package.json
├── src/
│   ├── node_modules/
│   │   └── lodash/        // 版本 4.17.20
│   │       └── package.json
│   └── app.js             // require('lodash') 会加载 4.17.20 版本
└── package.json
*/

// src/app.js
const lodash = require('lodash');  // 加载 src/node_modules/lodash
const express = require('express'); // 加载 node_modules/express

// 因为查找是从当前目录开始向上搜索 node_modules
```

## 5. 实际查找示例

### 复杂查找场景
```javascript
// 项目结构
/*
project/
├── node_modules/
│   ├── my-module/
│   │   ├── package.json (main: "dist/index.js")
│   │   └── dist/
│   │       └── index.js
│   └── utils/
│       ├── index.js
│       └── helper.js
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   └── index.js
│   └── main.js
└── package.json
*/

// src/main.js
console.log('当前文件:', __filename);
console.log('当前目录:', __dirname);

// 1. 核心模块查找
const fs = require('fs');  // 直接返回核心模块

// 2. 相对路径文件查找
const Button = require('./components/Button');  
// 查找顺序: ./components/Button.js -> ./components/Button.json -> ./components/Button.node

const components = require('./components');  
// 查找顺序: 
// 1. ./components/package.json (检查 main 字段)
// 2. ./components/index.js
// 3. ./components/index.json
// 4. ./components/index.node

// 3. node_modules 查找
const myModule = require('my-module');  
// 查找顺序:
// 1. ./node_modules/my-module/package.json (main: "dist/index.js")
// 2. ./node_modules/my-module/index.js
// 实际加载: ./node_modules/my-module/dist/index.js

const utils = require('utils');  
// 查找顺序: ./node_modules/utils/index.js
```

## 6. 特殊情况处理

### 缓存机制
```javascript
// Node.js 会缓存已加载的模块
console.log('模块缓存:', require.cache);

// 第一次加载
const module1 = require('./myModule');
console.log('缓存状态:', !!require.cache[require.resolve('./myModule')]);

// 第二次加载（从缓存获取）
const module2 = require('./myModule');
console.log('是否相同实例:', module1 === module2); // true

// 清除缓存（不推荐在生产环境使用）
delete require.cache[require.resolve('./myModule')];
const module3 = require('./myModule');
console.log('清除缓存后:', module1 === module3); // false
```

### 循环依赖处理
```javascript
// fileA.js
console.log('fileA 开始加载');
const fileB = require('./fileB');
console.log('fileB in fileA:', fileB);
module.exports = { name: 'fileA', fileB: fileB };
console.log('fileA 加载完成');

// fileB.js
console.log('fileB 开始加载');
const fileA = require('./fileA');
console.log('fileA in fileB:', fileA);
module.exports = { name: 'fileB', fileA: fileA };
console.log('fileB 加载完成');

// 执行 require('./fileA') 的输出：
// fileA 开始加载
// fileB 开始加载
// fileA in fileB: {}  // 注意：此时 fileA 还未完全加载完成
// fileB 加载完成
// fileB in fileA: { name: 'fileB', fileA: {} }
// fileA 加载完成
```

### 条件加载
```javascript
// 根据环境加载不同模块
function loadConfig() {
  try {
    // 优先加载环境特定配置
    return require(`./config/${process.env.NODE_ENV}`);
  } catch (error) {
    // 回退到默认配置
    return require('./config/default');
  }
}

const config = loadConfig();

// 根据文件存在性加载
function loadOptionalModule(moduleName) {
  try {
    return require(moduleName);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`模块 ${moduleName} 不存在，使用默认实现`);
      return { /* 默认实现 */ };
    }
    throw error;
  }
}

const optionalModule = loadOptionalModule('optional-dep');
```

## 7. 调试和工具

### 查看模块解析路径
```javascript
// 使用 require.resolve 查看模块解析路径
console.log('fs 模块路径:', require.resolve('fs'));
console.log('./myModule 路径:', require.resolve('./myModule'));

// 查看模块查找路径
console.log('模块查找路径:', module.paths);

// 自定义模块解析
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function(request, parent, isMain, options) {
  console.log(`解析模块: ${request}`);
  console.log(`父模块: ${parent && parent.filename}`);
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
```

### 使用 npm link 进行开发
```bash
# 在模块目录中
cd my-module
npm link  # 创建全局链接

# 在项目目录中
cd my-project
npm link my-module  # 链接到全局模块

# 现在 require('my-module') 会加载链接的版本
```

## 总结

Node.js 模块查找优先级和策略：

1. **核心模块优先**：内置模块具有最高优先级
2. **路径解析**：
   - 相对路径（./, `../`）：直接解析文件系统路径
   - 绝对路径（/）：直接解析
   - 模块名：逐级向上查找 `node_modules`
3. **文件扩展名顺序**：确切文件名 → .js → .json → `.node`
4. **目录模块**：package.json 的 `main` 字段 → index.js → `index.json` → `index.node`
5. **node_modules 查找**：从当前目录向上逐级搜索
6. **缓存机制**：已加载模块会被缓存，避免重复加载
7. **循环依赖**：通过返回未完全初始化的模块对象来处理

理解这些机制有助于更好地组织项目结构和解决模块加载问题。