---
title: common.js和es6中模块引入区别
--- 


## CommonJS 与 ES6 模块系统的详细对比

### 1. 基本概念

**CommonJS**:
- Node.js 早期采用的模块系统
- 主要用于服务端 JavaScript
- 运行时加载模块

**ES6 Modules (ESM)**:
- JavaScript 官方标准模块系统
- 现代浏览器和 Node.js 都支持
- 编译时确定模块依赖关系

### 2. 导出方式对比

#### CommonJS 导出

```javascript
// math.js - CommonJS 方式导出
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// 单个导出
module.exports.add = add;
module.exports.subtract = subtract;

// 或者整体导出对象
module.exports = {
  add,
  subtract
};

// 也可以使用 exports 简写（exports 是 module.exports 的引用）
exports.multiply = function(a, b) {
  return a * b;
};
```

#### ES6 模块导出

```javascript
// math.js - ES6 方式导出
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 默认导出
export default function multiply(a, b) {
  return a * b;
}

// 或者统一导出
function divide(a, b) {
  return a / b;
}

export { divide };
export { add as addition, subtract as subtraction }; // 别名导出
```

### 3. 导入方式对比

#### CommonJS 导入

```javascript
// app.js - CommonJS 方式导入
const math = require('./math');
// 导入所有导出内容

const { add, subtract } = require('./math');
// 解构导入特定函数

const multiply = require('./math').multiply;
// 导入特定函数

console.log(math.add(2, 3)); // 5
console.log(add(5, 4)); // 9
```

#### ES6 模块导入

```javascript
// app.js - ES6 方式导入
import multiply, { add, subtract } from './math.js';
// 导入默认导出和命名导出

import * as math from './math.js';
// 导入所有导出内容

import { add as sum, subtract as diff } from './math.js';
// 导入并使用别名

import './side-effect.js';
// 仅执行模块，不导入任何内容

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(math.subtract(10, 3)); // 7
```

### 4. 加载机制区别

#### CommonJS - 运行时加载

```javascript
// commonjs-example.js
console.log('开始加载模块');

// require 是同步的，运行时执行
const fs = require('fs');
const lodash = require('lodash');

// 可以在条件语句中使用 require
if (process.env.NODE_ENV === 'development') {
  const devTools = require('./dev-tools');
  devTools.enable();
}

// 可以动态决定加载哪个模块
const config = require(`./config/${process.env.NODE_ENV}`);
```

#### ES6 Modules - 编译时加载

```javascript
// es6-example.js
console.log('开始加载模块');

// import 语句会被提升到模块顶部
// 在编译时就确定了依赖关系
import fs from 'fs';
import lodash from 'lodash';

// 下面的代码在语法上是错误的
// 不能在条件语句中使用 import
// if (condition) {
//   import devTools from './dev-tools'; // 语法错误
// }

// 也不能动态拼接模块路径
// const env = process.env.NODE_ENV;
// import config from `./config/${env}`; // 语法错误

// 正确的做法是静态导入
import devTools from './dev-tools';
import configDev from './config/development';
import configProd from './config/production';
```

### 5. 循环依赖处理

#### CommonJS 循环依赖

```javascript
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');

// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js'); // 这时 a 还未初始化完成
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');

// main.js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);
```

输出结果：
```
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done=true, b.done=true
```

#### ES6 Modules 循环依赖

```javascript
// a.js
import { done as bDone } from './b.js';
console.log('a starting');
export let done = false;
console.log('in a, b.done = %j', bDone);
done = true;
console.log('a done');

// b.js
import { done as aDone } from './a.js';
console.log('b starting');
export let done = false;
console.log('in b, a.done = %j', aDone);
done = true;
console.log('b done');
```

这会导致错误，因为 ES6 模块在编译时就需要确定所有依赖。

### 6. this 指向区别

```javascript
// commonjs-this.js
console.log(this); // {}
exports.test = function() {
  console.log(this === exports); // true
};

// es6-this.js
console.log(this); // undefined (在模块顶层)
export function test() {
  console.log(this); // undefined (严格模式)
}
```

### 7. 实际应用场景

#### CommonJS 适用场景

```javascript
// 服务器端动态加载配置
function loadConfig() {
  const env = process.env.NODE_ENV || 'development';
  return require(`./config/${env}.json`);
}

// 条件加载模块
function getDatabase() {
  if (process.env.DB_TYPE === 'mysql') {
    return require('./db/mysql');
  } else if (process.env.DB_TYPE === 'postgres') {
    return require('./db/postgres');
  }
}
```

#### ES6 Modules 适用场景

```javascript
// 静态分析工具可以更好地优化
import { debounce } from 'lodash';
import { UserService } from './services/user-service';
import { API_ENDPOINTS } from './constants';

// 树摇优化 (Tree shaking)
import { add, multiply } from './math-utils';
// 只会打包 add 和 multiply 函数，其他未使用的导出会被移除

// 更好的类型支持 (TypeScript)
import type { User } from './types';
```

### 8. 互操作性

```javascript
// 在 Node.js 中混合使用
// es-module-wrapper.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 在 ES 模块中使用 CommonJS
const lodash = require('lodash');

// commonjs-wrapper.cjs
const { add, multiply } = await import('./math-utils.js');
```

### 总结

| 特性 | CommonJS | ES6 Modules |
|------|----------|-------------|
| 加载时机 | 运行时 | 编译时 |
| 导入语法 | `require()` | `import` |
| 导出语法 | `module.exports` | `export` |
| this 指向 | 指向 exports 对象 | undefined |
| 循环依赖 | 支持，但需小心处理 | 编译时报错 |
| 静态分析 | 不支持 | 支持 |
| 树摇优化 | 不支持 | 支持 |
| 浏览器支持 | 需要编译 | 原生支持 |
| Node.js 支持 | 原生支持 | 需要 .mjs 扩展名或 package.json 配置 |
