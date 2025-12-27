---
title: Nodejs中的事件循环机制理解
---

Node.js 事件循环机制是其高性能和非阻塞 I/O 的核心，让我详细解释其工作原理。

## 1. 事件循环基本概念

### 什么是事件循环？

事件循环是 Node.js 处理非阻塞 I/O 操作的机制，允许 Node.js 执行异步操作而不会阻塞主线程。

```javascript
// 同步代码示例
console.log('1');

// 异步代码示例
setTimeout(() => {
  console.log('2');
}, 0);

// 同步代码
console.log('3');

// 输出顺序：1 -> 3 -> 2
// 说明 setTimeout 回调被放入事件循环队列，等同步代码执行完才执行
```

### Node.js 架构图解
```
┌───────────────────────────┐
│           V8              │
├───────────────────────────┤
│        libuv (事件循环)    │
├───────────────────────────┤
│   系统调用 (epoll/kqueue)  │
└───────────────────────────┘
```

## 2. 事件循环的六个阶段

### 阶段详解

```javascript
// 模拟事件循环各阶段的执行
const fs = require('fs');

console.log('开始执行');

// timers 阶段
setTimeout(() => {
  console.log('timer 回调 1');
}, 0);

setTimeout(() => {
  console.log('timer 回调 2');
}, 100);

// pending callbacks 阶段（系统回调）
// 通常由 TCP 错误等系统操作产生

// idle, prepare 阶段（内部使用）

// poll 阶段
setImmediate(() => {
  console.log('immediate 回调');
});

fs.readFile(__filename, () => {
  console.log('I/O 回调');
});

// check 阶段
process.nextTick(() => {
  console.log('nextTick 回调');
});

// close callbacks 阶段
const server = require('net').createServer();
server.close(() => {
  console.log('close 回调');
});

console.log('执行结束');

// 输出顺序：
// 开始执行
// 执行结束
// nextTick 回调
// timer 回调 1
// I/O 回调
// immediate 回调
// timer 回调 2
// close 回调
```

### 各阶段详细说明

```javascript
// 1. timers 阶段：执行 setTimeout 和 setInterval 回调
setTimeout(() => {
  console.log('timers 阶段');
}, 10);

// 2. pending callbacks 阶段：执行系统操作回调
// 例如 TCP 错误回调

// 3. idle, prepare 阶段：内部使用

// 4. poll 阶段：执行 I/O 回调
const fs = require('fs');
fs.readFile('file.txt', () => {
  console.log('poll 阶段 - I/O 回调');
});

// 5. check 阶段：执行 setImmediate 回调
setImmediate(() => {
  console.log('check 阶段');
});

// 6. close callbacks 阶段：执行关闭事件回调
const server = require('http').createServer();
server.on('close', () => {
  console.log('close callbacks 阶段');
});
```

## 3. 微任务和宏任务

### nextTick 队列和微任务队列

```javascript
console.log('1');

// nextTick 队列（优先级最高）
process.nextTick(() => {
  console.log('nextTick 1');
  
  process.nextTick(() => {
    console.log('nextTick 2');
  });
});

// 微任务队列（Promise）
Promise.resolve().then(() => {
  console.log('Promise 1');
  
  process.nextTick(() => {
    console.log('nextTick in Promise');
  });
});

Promise.resolve().then(() => {
  console.log('Promise 2');
});

// 宏任务队列
setTimeout(() => {
  console.log('setTimeout');
}, 0);

console.log('2');

// 输出顺序：
// 1
// 2
// nextTick 1
// nextTick 2
// Promise 1
// Promise 2
// nextTick in Promise
// setTimeout
```

### 队列优先级示例

```javascript
// 演示不同队列的优先级
setImmediate(() => console.log('setImmediate 1'));

setTimeout(() => console.log('setTimeout 1'), 0);

process.nextTick(() => console.log('nextTick 1'));

Promise.resolve().then(() => console.log('Promise 1'));

console.log('同步代码');

// 输出顺序：
// 同步代码
// nextTick 1
// Promise 1
// setTimeout 1
// setImmediate 1

// 注意：setTimeout 和 setImmediate 的执行顺序在不同环境下可能不同
```

## 4. 事件循环详细执行流程

### 完整的执行周期

```javascript
// 模拟一个完整的事件循环周期
function simulateEventLoop() {
  console.log('=== 事件循环周期开始 ===');
  
  // timers 阶段
  console.log('进入 timers 阶段');
  // 执行到期的 setTimeout/setInterval 回调
  
  // pending callbacks 阶段
  console.log('进入 pending callbacks 阶段');
  // 执行系统回调
  
  // poll 阶段
  console.log('进入 poll 阶段');
  // 执行 I/O 回调
  // 如果没有定时器到期且有 setImmediate，则阻塞等待
  // 否则等待新的 I/O 事件或定时器到期
  
  // check 阶段
  console.log('进入 check 阶段');
  // 执行 setImmediate 回调
  
  // close callbacks 阶段
  console.log('进入 close callbacks 阶段');
  // 执行关闭回调
  
  console.log('=== 事件循环周期结束 ===');
}

// 实际示例
console.log('同步代码开始');

setTimeout(() => {
  console.log('setTimeout 回调');
}, 0);

setImmediate(() => {
  console.log('setImmediate 回调');
});

process.nextTick(() => {
  console.log('nextTick 回调');
});

Promise.resolve().then(() => {
  console.log('Promise 回调');
});

const fs = require('fs');
fs.readFile(__filename, () => {
  console.log('文件读取回调');
  
  // 在 I/O 回调中添加新的异步操作
  setImmediate(() => {
    console.log('嵌套的 setImmediate');
  });
  
  process.nextTick(() => {
    console.log('嵌套的 nextTick');
  });
});

console.log('同步代码结束');

// 输出顺序：
// 同步代码开始
// 同步代码结束
// nextTick 回调
// Promise 回调
// setTimeout 回调
// 文件读取回调
// 嵌套的 nextTick
// 嵌套的 setImmediate
// setImmediate 回调
```

## 5. 性能优化和注意事项

### 避免阻塞事件循环

```javascript
// ❌ 错误做法：长时间同步操作阻塞事件循环
function blockingOperation() {
  let result = 0;
  for (let i = 0; i < 1e9; i++) {
    result += Math.random();
  }
  return result;
}

console.log('开始');
console.log('计算结果:', blockingOperation());
console.log('结束');

// ✅ 正确做法：将长时间操作分解
async function nonBlockingOperation() {
  let result = 0;
  const total = 1e9;
  const batchSize = 1e6;
  
  for (let i = 0; i < total; i += batchSize) {
    await new Promise(resolve => {
      setImmediate(() => {
        const end = Math.min(i + batchSize, total);
        for (let j = i; j < end; j++) {
          result += Math.random();
        }
        resolve();
      });
    });
  }
  
  return result;
}

console.log('开始');
nonBlockingOperation().then(result => {
  console.log('计算结果:', result);
  console.log('结束');
});
```

### 合理使用 nextTick

```javascript
// ❌ 错误：可能导致无限循环
function badRecursiveNextTick() {
  console.log('递归调用');
  process.nextTick(badRecursiveNextTick); // 危险！
}

// ✅ 正确：限制递归深度
let depth = 0;
function goodRecursiveNextTick() {
  console.log('递归调用，深度:', ++depth);
  
  if (depth < 100) {
    process.nextTick(goodRecursiveNextTick);
  } else {
    console.log('达到最大深度');
  }
}

// ✅ 更好的做法：使用 setImmediate
function betterRecursive() {
  console.log('递归调用');
  setImmediate(betterRecursive); // 不会阻塞事件循环
}
```

## 6. 实际应用示例

### 异步任务调度器

```javascript
class AsyncTaskScheduler {
  constructor() {
    this.tasks = [];
    this.running = false;
  }
  
  addTask(task) {
    this.tasks.push(task);
    if (!this.running) {
      this.run();
    }
  }
  
  async run() {
    this.running = true;
    
    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      
      try {
        await task();
      } catch (error) {
        console.error('任务执行失败:', error);
      }
      
      // 让出控制权给事件循环
      await new Promise(resolve => setImmediate(resolve));
    }
    
    this.running = false;
  }
}

// 使用示例
const scheduler = new AsyncTaskScheduler();

for (let i = 0; i < 10; i++) {
  scheduler.addTask(async () => {
    console.log(`执行任务 ${i}`);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 100));
  });
}
```

### 事件循环监控

```javascript
// 监控事件循环性能
class EventLoopMonitor {
  constructor() {
    this.latencies = [];
    this.maxLatencies = 1000;
  }
  
  start() {
    const monitor = () => {
      const start = process.hrtime.bigint();
      
      setImmediate(() => {
        const end = process.hrtime.bigint();
        const latency = Number(end - start) / 1000000; // 转换为毫秒
        
        this.latencies.push(latency);
        if (this.latencies.length > this.maxLatencies) {
          this.latencies.shift();
        }
        
        // 输出统计信息
        if (this.latencies.length % 100 === 0) {
          const avg = this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
          const max = Math.max(...this.latencies);
          const min = Math.min(...this.latencies);
          
          console.log(`事件循环延迟 - 平均: ${avg.toFixed(2)}ms, 最大: ${max.toFixed(2)}ms, 最小: ${min.toFixed(2)}ms`);
        }
        
        monitor(); // 继续监控
      });
    };
    
    monitor();
  }
  
  getStats() {
    if (this.latencies.length === 0) return null;
    
    const avg = this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
    const max = Math.max(...this.latencies);
    const min = Math.min(...this.latencies);
    
    return { avg, max, min, count: this.latencies.length };
  }
}

// 使用监控器
const monitor = new EventLoopMonitor();
monitor.start();

// 模拟一些工作负载
setInterval(() => {
  // 模拟 I/O 操作
  setTimeout(() => {
    console.log('定时任务执行');
  }, Math.random() * 100);
}, 100);
```

## 7. 调试和分析工具

### 使用 perf_hooks 分析

```javascript
const { PerformanceObserver, performance } = require('perf_hooks');

// 监控异步操作性能
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ['measure'] });

// 标记开始时间
performance.mark('start');

// 模拟异步操作
setTimeout(() => {
  performance.mark('end');
  performance.measure('setTimeout 延迟', 'start', 'end');
}, 100);
```

### 使用 async_hooks 跟踪异步资源

```javascript
const async_hooks = require('async_hooks');

// 创建异步钩子
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    console.log(`初始化异步资源: ${type} (${asyncId})`);
  },
  before(asyncId) {
    console.log(`异步回调前: ${asyncId}`);
  },
  after(asyncId) {
    console.log(`异步回调后: ${asyncId}`);
  },
  destroy(asyncId) {
    console.log(`销毁异步资源: ${asyncId}`);
  }
});

hook.enable();

// 测试异步操作
setTimeout(() => {
  console.log('定时器回调');
}, 100);

Promise.resolve().then(() => {
  console.log('Promise 回调');
});
```

## 总结

Node.js 事件循环的关键要点：

1. **六个阶段**：timers → pending callbacks → idle/prepare → poll → check → close callbacks
2. **队列优先级**：nextTick 队列 > 微任务队列 > 宏任务队列
3. **非阻塞特性**：通过事件循环实现高并发处理
4. **性能考虑**：避免长时间同步操作，合理使用异步 API
5. **调试工具**：使用 perf_hooks 和 async_hooks 进行性能分析

理解事件循环机制对于编写高性能的 Node.js 应用至关重要。