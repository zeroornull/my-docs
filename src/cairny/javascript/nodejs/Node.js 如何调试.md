---
title: Node.js 如何调试
---

Node.js 提供了多种调试方式，从简单的 console 日志到专业的调试工具。以下是主要的调试方法：

## 1. 基础调试方法

### Console 日志调试

```javascript
// 基本的 console 调试
function calculateSum(a, b) {
  console.log('参数 a:', a, '参数 b:', b); // 输出变量值
  const result = a + b;
  console.log('计算结果:', result); // 输出中间结果
  return result;
}

// 使用 console.table 显示对象数组
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
console.table(users);

// 使用 console.time 计时
console.time('计算耗时');
// 执行一些操作
for (let i = 0; i < 1000000; i++) {
  Math.random();
}
console.timeEnd('计算耗时');
```

### 使用 debugger 语句

```javascript
function processData(data) {
  debugger; // 在此处设置断点
  const processed = data.map(item => item * 2);
  debugger; // 另一个断点
  return processed;
}

processData([1, 2, 3, 4, 5]);
```

## 2. Node.js 内置调试器

### 使用 inspect 参数

```bash
# 启动调试模式
node --inspect app.js

# 指定调试端口
node --inspect=9229 app.js

# 立即暂停执行
node --inspect-brk app.js
```

### Chrome DevTools 调试

1. 运行 `node --inspect app.js`
2. 打开 Chrome 浏览器，访问 `chrome://inspect`
3. 点击 "Open dedicated DevTools for Node"
4. 在 Sources 面板中设置断点调试

```javascript
// 示例应用
const http = require('http');

const server = http.createServer((req, res) => {
  debugger; // 可以在这里设置断点
  console.log('收到请求:', req.url);
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('服务器运行在端口 3000');
});
```

## 3. VS Code 调试

### 配置 launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "program": "${workspaceFolder}/app.js",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "attach",
      "name": "附加到进程",
      "port": 9229
    }
  ]
}
```

### 调试 Express 应用

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const name = req.query.name || 'World';
  debugger; // VS Code 中可以在这里断点调试
  res.send(`Hello ${name}!`);
});

app.listen(3000, () => {
  console.log('应用启动在端口 3000');
});
```

## 4. 使用 ndb 调试器

```bash
# 安装 ndb
npm install -g ndb

# 使用 ndb 调试
ndb app.js
```

## 5. 高级调试技巧

### 使用 util.inspect 深度查看对象

```javascript
const util = require('util');

const complexObject = {
  user: {
    name: 'Alice',
    profile: {
      preferences: {
        theme: 'dark',
        language: 'en'
      }
    }
  },
  data: [1, 2, 3, { nested: true }]
};

// 深度打印对象
console.log(util.inspect(complexObject, { depth: null, colors: true }));

// 格式化输出
console.log(util.format('用户 %s 的主题是 %s', 
  complexObject.user.name, 
  complexObject.user.profile.preferences.theme));
```

### 使用性能分析

```javascript
// CPU 性能分析
console.profile('性能分析');
// 执行需要分析的代码
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
console.profileEnd('性能分析');

// 内存使用情况
console.log('内存使用:', process.memoryUsage());

// 堆快照
const v8 = require('v8');
console.log('堆统计:', v8.getHeapStatistics());
```

## 6. 使用第三方调试工具

### debug 模块

```bash
npm install debug
```

```javascript
const debug = require('debug')('app:database');
const httpDebug = require('debug')('app:http');

// 设置 DEBUG=app:* 环境变量来启用调试
debug('连接数据库...');
httpDebug('处理 HTTP 请求');

function fetchUser(id) {
  debug('获取用户 ID: %d', id);
  // 模拟数据库查询
  const user = { id, name: `User${id}` };
  debug('用户数据: %o', user);
  return user;
}

fetchUser(123);
```

运行时启用调试：
```bash
DEBUG=app:* node app.js
DEBUG=app:database node app.js
```

### 使用 Winston 日志库

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

function processOrder(order) {
  logger.debug('开始处理订单', { orderId: order.id });
  
  try {
    // 处理订单逻辑
    logger.info('订单处理成功', { orderId: order.id });
  } catch (error) {
    logger.error('订单处理失败', {
      orderId: order.id,
      error: error.message,
      stack: error.stack
    });
  }
}

processOrder({ id: '12345', items: ['item1', 'item2'] });
```

## 7. 异步调试技巧

### 调试 Promise

```javascript
async function fetchUserData(userId) {
  console.log('开始获取用户数据, 用户ID:', userId);
  
  try {
    // 模拟 API 调用
    const user = await getUserFromAPI(userId);
    console.log('获取到用户信息:', user);
    
    const permissions = await getUserPermissions(user.id);
    console.log('用户权限:', permissions);
    
    return { user, permissions };
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
}

function getUserFromAPI(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: `User${userId}` });
    }, 1000);
  });
}

function getUserPermissions(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['read', 'write']);
    }, 500);
  });
}

// 调试异步函数
fetchUserData(123).then(result => {
  console.log('最终结果:', result);
});
```

### 使用 async_hooks 追踪异步资源

```javascript
const async_hooks = require('async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`初始化异步资源: ${type}(${asyncId}) 触发者: ${triggerAsyncId}`);
  },
  destroy(asyncId) {
    console.log(`销毁异步资源: ${asyncId}`);
  }
});

asyncHook.enable();

async function example() {
  console.log('开始执行异步函数');
  await Promise.resolve();
  console.log('异步函数执行完成');
}

example();
```

## 8. 调试最佳实践

### 创建调试配置文件

```javascript
// config/debug.js
const DEBUG = process.env.NODE_ENV !== 'production';

const debugConfig = {
  logLevel: DEBUG ? 'debug' : 'info',
  enableProfiling: DEBUG,
  enableDetailedErrors: DEBUG
};

module.exports = debugConfig;
```

### 结构化调试信息

```javascript
// utils/logger.js
class Logger {
  constructor(namespace) {
    this.namespace = namespace;
  }
  
  debug(message, data) {
    if (process.env.DEBUG) {
      console.log(`[DEBUG][${this.namespace}] ${message}`, data || '');
    }
  }
  
  info(message, data) {
    console.info(`[INFO][${this.namespace}] ${message}`, data || '');
  }
  
  error(message, error) {
    console.error(`[ERROR][${this.namespace}] ${message}`, error);
  }
}

module.exports = Logger;

// 使用示例
const Logger = require('./utils/logger');
const logger = new Logger('UserService');

function getUser(id) {
  logger.debug('获取用户', { id });
  // 业务逻辑
  logger.info('用户获取成功', { userId: id });
}
```

## 总结

Node.js 调试的主要方法包括：

1. **基础调试**：console.log、debugger 语句
2. **内置调试器**：--inspect 参数配合 Chrome DevTools
3. **IDE 调试**：VS Code 等编辑器的调试功能
4. **专业工具**：ndb、debug 模块、Winston 日志库
5. **性能分析**：CPU 和内存分析工具
6. **异步调试**：处理 Promise 和 async/await 的调试技巧

选择合适的调试方法取决于具体场景和需求，通常建议结合多种方法来提高调试效率。