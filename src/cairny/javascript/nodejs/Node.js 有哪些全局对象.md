---
title: Node.js 有哪些全局对象
---

## Node.js 全局对象详解

Node.js 提供了许多全局对象，这些对象在任何地方都可以直接访问，无需通过 `require()` 引入。它们构成了 Node.js 运行时环境的基础。

### 1. 核心全局对象

#### `global`
全局对象本身，类似于浏览器中的 `window` 对象

```javascript
// global 对象示例
global.myGlobalVar = 'Hello World';
console.log(myGlobalVar); // 可以直接访问

// 在模块中 this 指向 module.exports，而非 global
console.log(this === global); // false
console.log(this === module.exports); // true
```

#### `process`
提供了与当前 Node.js 进程相关的信息和控制方法

```javascript
// 已在前面详细讲解，这里简单示例
console.log(process.version); // Node.js 版本
console.log(process.pid);     // 进程 ID
process.exit(0);             // 退出进程
```

#### `console`
用于打印信息到 stdout 和 stderr

```javascript
// 基本用法
console.log('普通信息');
console.error('错误信息');
console.warn('警告信息');

// 高级用法
console.table([{name: 'John', age: 30}, {name: 'Jane', age: 25}]);
console.time('timer');
// 一些操作
console.timeEnd('timer');
```

#### `Buffer`
用于处理二进制数据

```javascript
// 创建 Buffer
const buf1 = Buffer.alloc(10);           // 创建10字节的零填充Buffer
const buf2 = Buffer.from('hello');       // 从字符串创建Buffer
const buf3 = Buffer.from([1, 2, 3, 4]);  // 从数组创建Buffer

console.log(buf2.toString()); // 'hello'
console.log(buf2.length);     // 5
```

### 2. 计时器函数

#### `setTimeout(callback, delay[, ...args])`
延迟执行函数

```javascript
const timeoutId = setTimeout(() => {
  console.log('延迟执行');
}, 1000);

// 取消定时器
clearTimeout(timeoutId);
```

#### `setInterval(callback, delay[, ...args])`
重复执行函数

```javascript
const intervalId = setInterval(() => {
  console.log('每秒执行');
}, 1000);

// 取消间隔执行
clearInterval(intervalId);
```

#### `setImmediate(callback[, ...args])`
在当前事件循环末尾执行

```javascript
setImmediate(() => {
  console.log('在事件循环末尾执行');
});

console.log('这会先执行');
```

### 3. 模块相关全局对象

#### `__dirname`
当前模块的目录名

```javascript
console.log(__dirname); 
// 输出: /Users/username/project/src

// 获取当前文件的目录
const path = require('path');
const currentDir = path.basename(__dirname);
console.log('当前目录名:', currentDir);
```

#### `__filename`
当前模块的文件名（完整路径）

```javascript
console.log(__filename);
// 输出: /Users/username/project/src/app.js

// 获取文件名
const fileName = path.basename(__filename);
console.log('文件名:', fileName); // app.js
```

#### `module`
对当前模块的引用

```javascript
console.log(module);
// 包含 id, exports, parent, filename, loaded, children 等属性

// 导出内容
module.exports = {
  name: 'myModule',
  version: '1.0.0'
};
```

#### `exports`
`module.exports` 的简写引用

```javascript
// 以下两种写法等价
exports.myFunction = function() {
  return 'Hello';
};

module.exports.myFunction = function() {
  return 'Hello';
};

// 注意：不能直接给 exports 赋值
exports = {  // 这样不会生效
  myFunction: () => 'Hello'
};
```

#### `require()`
用于引入模块

```javascript
// 内置模块
const fs = require('fs');
const path = require('path');

// 第三方模块
const express = require('express');

// 本地模块
const myModule = require('./myModule');
const utils = require('../utils');

// 使用 require.resolve 获取模块路径
const modulePath = require.resolve('express');
console.log(modulePath);
```

### 4. 其他重要全局对象

#### `URL` 和 `URLSearchParams`
用于处理 URL

```javascript
const myURL = new URL('https://example.com:8080/path?query=1');
console.log(myURL.hostname); // 'example.com'
console.log(myURL.port);     // '8080'

const params = new URLSearchParams('name=John&age=30');
console.log(params.get('name')); // 'John'
```

#### `TextEncoder` 和 `TextDecoder`
用于文本编码和解码

```javascript
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const encoded = encoder.encode('Hello World');
console.log(encoded); // Uint8Array

const decoded = decoder.decode(encoded);
console.log(decoded); // 'Hello World'
```

### 5. 全局对象的分类

#### 真正的全局对象（在任何地方都可访问）
```javascript
// 这些在任何作用域中都可直接访问
global, process, console, Buffer,
setTimeout, setInterval, setImmediate,
clearTimeout, clearInterval, clearImmediate
```

#### 模块级全局对象（只在模块内有效）
```javascript
// 这些只在当前模块中有效
__dirname, __filename, module, exports, require
```

### 6. 实际应用示例

#### 创建一个工具模块展示全局对象使用

```javascript
// utils.js
class Utils {
  static logInfo(message) {
    // 使用 console 全局对象
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  }
  
  static createBufferFromString(str) {
    // 使用 Buffer 全局对象
    return Buffer.from(str, 'utf8');
  }
  
  static delay(ms) {
    // 使用 Promise 和 setTimeout
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  static getModuleInfo() {
    // 使用模块相关全局对象
    return {
      filename: __filename,
      dirname: __dirname,
      moduleId: module.id,
      requiredBy: module.parent ? module.parent.filename : 'main'
    };
  }
  
  static scheduleTask(task, delay) {
    // 使用计时器全局函数
    const timeoutId = setTimeout(task, delay);
    return timeoutId;
  }
}

// 导出工具类
module.exports = Utils;

// 使用示例
if (require.main === module) {
  // 当直接运行此文件时执行
  Utils.logInfo('工具模块直接运行');
  console.log(Utils.getModuleInfo());
}
```

#### 使用全局对象构建一个简单的服务器监控

```javascript
// monitor.js
class ProcessMonitor {
  constructor() {
    this.startTime = Date.now();
    this.setupMonitoring();
  }
  
  setupMonitoring() {
    // 监控内存使用
    setInterval(() => {
      const memory = process.memoryUsage();
      console.log(`内存使用: ${Math.round(memory.heapUsed / 1024 / 1024)} MB`);
    }, 5000);
    
    // 监控进程信号
    process.on('SIGINT', () => {
      console.log('收到中断信号，正在退出...');
      this.cleanup();
    });
    
    process.on('uncaughtException', (err) => {
      console.error('未捕获异常:', err);
      this.cleanup(1);
    });
  }
  
  cleanup(exitCode = 0) {
    console.log('执行清理工作...');
    // 清理资源
    process.exit(exitCode);
  }
  
  getProcessInfo() {
    return {
      pid: process.pid,
      uptime: process.uptime(),
      version: process.version,
      platform: process.platform,
      memory: process.memoryUsage()
    };
  }
}

// 全局可访问的监控实例
global.monitor = new ProcessMonitor();

console.log('监控已启动');
console.log('进程信息:', global.monitor.getProcessInfo());
```

### 总结

Node.js 的全局对象可以分为几类：

1. **核心全局对象**：`global`, `process`, `console`, `Buffer`
2. **计时器函数**：`setTimeout`, `setInterval`, `setImmediate` 等
3. **模块相关**：`__dirname`, `__filename`, `module`, `exports`, `require`
4. **Web 标准对象**：`URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`

这些全局对象为 Node.js 应用提供了运行环境的基础功能，理解它们的用途和使用方法对于开发 Node.js 应用非常重要。