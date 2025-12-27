---
title: Node 中的 process
---

## Node.js 中的 `process` 对象详解

`process` 是 Node.js 中的一个全局对象，它提供了与当前 Node.js 进程相关的信息和控制方法。它是 `EventEmitter` 的实例，允许你监听和响应各种进程事件。

### 主要特性

1. **全局可访问**：无需 require，直接在任何地方使用
2. **进程信息**：提供运行时环境信息
3. **进程控制**：允许控制进程行为
4. **事件驱动**：支持监听各种进程事件

### 常用属性

```javascript
// 获取进程相关信息
console.log('进程ID:', process.pid);
console.log('Node版本:', process.version);
console.log('平台信息:', process.platform);
console.log('进程运行时间:', process.uptime());
console.log('内存使用情况:', process.memoryUsage());
console.log('环境变量:', process.env);
```

### 常用方法详解

#### 1. `process.exit([code])`
退出当前进程，可选退出码

```javascript
// 正常退出
process.exit(0);

// 异常退出
process.exit(1);

// 在退出前执行清理工作
process.on('exit', (code) => {
  console.log(`进程即将退出，退出码: ${code}`);
  // 注意：这里只能执行同步操作
});
```

#### 2. `process.cwd()`
获取当前工作目录

```javascript
console.log('当前工作目录:', process.cwd());
// 输出示例: /Users/username/my-project
```

#### 3. `process.chdir(directory)`
改变当前工作目录

```javascript
try {
  process.chdir('/tmp');
  console.log('新工作目录:', process.cwd());
} catch (err) {
  console.error('改变目录失败:', err);
}
```

#### 4. `process.nextTick(callback[, ...args])`
将回调函数添加到"next tick"队列

```javascript
console.log('开始');

process.nextTick(() => {
  console.log('nextTick 回调');
});

console.log('结束');

// 输出顺序:
// 开始
// 结束
// nextTick 回调
```

#### 5. `process.argv`
获取命令行参数

```javascript
// 命令: node script.js arg1 arg2
console.log(process.argv);
// 输出: ['node路径', '脚本路径', 'arg1', 'arg2']

// 实际应用示例
const args = process.argv.slice(2);
console.log('传入的参数:', args);
```

#### 6. `process.env`
访问环境变量

```javascript
// 读取环境变量
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);

// 设置环境变量
process.env.MY_VAR = 'hello';
console.log(process.env.MY_VAR); // 输出: hello
```

#### 7. `process.memoryUsage()`
获取内存使用情况

```javascript
const util = require('util');

console.log(util.inspect(process.memoryUsage()));
// 输出示例:
// {
//   rss: 28495872,        // 常驻内存大小
//   heapTotal: 6012928,   // V8堆内存总大小
//   heapUsed: 4475432,    // V8堆内存已使用
//   external: 1740584     // 外部内存使用
// }
```

### 常用事件

#### 1. `exit` 事件
进程即将退出时触发

```javascript
process.on('exit', (code) => {
  console.log(`进程退出，退出码: ${code}`);
  // 只能执行同步操作
});
```

#### 2. `beforeExit` 事件
当 Node.js 清空事件循环且没有其他安排时触发

```javascript
process.on('beforeExit', (code) => {
  console.log('进程即将退出，但可能被重新调度');
  // 可以执行异步操作
  setTimeout(() => {
    console.log('异步操作');
  }, 1000);
});
```

#### 3. `uncaughtException` 事件
捕获未处理的异常

```javascript
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1); // 建议退出进程
});

// 测试
setTimeout(() => {
  throw new Error('测试异常');
}, 1000);
```

#### 4. `unhandledRejection` 事件
处理未处理的 Promise 拒绝

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  console.error('Promise:', promise);
});

// 测试
Promise.reject(new Error('测试拒绝'));
```

#### 5. `SIGINT` 事件
处理中断信号（如 Ctrl+C）

```javascript
process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号');
  process.exit(0);
});
```

### 实际应用示例

#### 1. 命令行参数解析

```javascript
// simple-cli.js
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++;
    }
  }
  
  return options;
}

const options = parseArgs();
console.log('解析的参数:', options);

// 使用: node simple-cli.js --name John --age 30
```

#### 2. 进程监控和优雅退出

```javascript
// graceful-shutdown.js
class App {
  constructor() {
    this.setupSignalHandlers();
  }
  
  setupSignalHandlers() {
    // 处理 SIGTERM 信号 (如 Docker 停止容器)
    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，开始优雅退出...');
      this.shutdown();
    });
    
    // 处理 SIGINT 信号 (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('收到 SIGINT 信号，开始优雅退出...');
      this.shutdown();
    });
    
    // 处理未捕获异常
    process.on('uncaughtException', (err) => {
      console.error('未捕获异常:', err);
      this.shutdown(1);
    });
  }
  
  async shutdown(exitCode = 0) {
    try {
      console.log('正在关闭服务器...');
      // 这里可以添加数据库连接关闭、服务器关闭等清理工作
      console.log('清理工作完成');
    } catch (err) {
      console.error('关闭过程中出错:', err);
      exitCode = 1;
    } finally {
      process.exit(exitCode);
    }
  }
}

const app = new App();
console.log('应用启动，PID:', process.pid);

// 模拟应用运行
setInterval(() => {
  console.log('应用运行中...');
}, 5000);
```

### 总结

`process` 对象是 Node.js 中非常重要的全局对象，它让我们能够：
- 获取运行时信息
- 控制进程行为
- 处理系统信号
- 管理异常情况
- 与操作系统交互

掌握 `process` 对象的使用对于编写健壮的 Node.js 应用至关重要。