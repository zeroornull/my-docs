---
title: 浏览器和 Node 中的事件循环的区别
---

浏览器和 Node.js 中的事件循环（Event Loop）虽然概念相似，但在实现和细节上有显著差异。让我详细解释这些区别：

## 1. 基本概念对比

### 浏览器中的事件循环
```javascript
// 浏览器中的典型事件循环示例
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1 -> 4 -> 3 -> 2
```

### Node.js 中的事件循环
```javascript
// Node.js 中的事件循环示例
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

process.nextTick(() => {
  console.log('3');
});

Promise.resolve().then(() => {
  console.log('4');
});

console.log('5');

// 输出顺序：1 -> 5 -> 3 -> 4 -> 2
```

## 2. 阶段（Phases）差异

### 浏览器事件循环阶段
浏览器的事件循环相对简单，主要包括：

1. **执行调用栈中的同步代码**
2. **处理微任务队列（Microtasks）**
3. **处理宏任务队列（Macrotasks）**

```javascript
// 浏览器中的任务分类示例
console.log('Start');

// 宏任务 (Macrotask)
setTimeout(() => console.log('Timeout 1'), 0);
setInterval(() => console.log('Interval'), 1000);

// 微任务 (Microtask)
Promise.resolve().then(() => console.log('Promise 1'));
queueMicrotask(() => console.log('QueueMicrotask 1'));

console.log('End');

// 执行顺序：
// Start -> End -> Promise 1 -> QueueMicrotask 1 -> Timeout 1 -> Interval
```

### Node.js 事件循环阶段
Node.js 的事件循环更加复杂，分为多个明确的阶段：

```javascript
// Node.js 事件循环的六个阶段
const fs = require('fs');

// 1. timers 阶段
setTimeout(() => {
  console.log('Timer callback');
}, 0);

// 2. pending callbacks 阶段
// 系统操作回调（如 TCP 错误）

// 3. idle, prepare 阶段
// 内部使用

// 4. poll 阶段
setImmediate(() => {
  console.log('Immediate callback');
});

// 5. check 阶段
fs.readFile(__filename, () => {
  console.log('I/O callback');
});

// 6. close callbacks 阶段
// 关闭回调
```

## 3. 微任务处理差异

### 浏览器中的微任务
```javascript
// 浏览器中微任务的处理
console.log('Start');

// Promise 微任务
Promise.resolve().then(() => {
  console.log('Promise 1');
  return Promise.resolve();
}).then(() => {
  console.log('Promise 2');
});

// queueMicrotask 微任务
queueMicrotask(() => {
  console.log('Microtask 1');
});

console.log('End');

// 浏览器输出：
// Start -> End -> Promise 1 -> Microtask 1 -> Promise 2
```

### Node.js 中的微任务
```javascript
// Node.js 中微任务的处理
console.log('Start');

// process.nextTick 队列（优先级最高）
process.nextTick(() => {
  console.log('NextTick 1');
  process.nextTick(() => {
    console.log('NextTick 2');
  });
});

// Promise 微任务
Promise.resolve().then(() => {
  console.log('Promise 1');
});

console.log('End');

// Node.js 输出：
// Start -> End -> NextTick 1 -> NextTick 2 -> Promise 1
```

## 4. API 差异

### 浏览器特有的 API
```javascript
// 浏览器特有的事件循环相关 API
// 1. requestAnimationFrame
requestAnimationFrame(() => {
  console.log('Before repaint');
});

// 2. IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  console.log('Element visibility changed');
});

// 3. MutationObserver
const mutationObserver = new MutationObserver((mutations) => {
  console.log('DOM changed');
});
```

### Node.js 特有的 API
```javascript
// Node.js 特有的事件循环相关 API
// 1. process.nextTick
process.nextTick(() => {
  console.log('Next tick callback');
});

// 2. setImmediate
setImmediate(() => {
  console.log('Immediate callback');
});

// 3. 微任务队列控制
queueMicrotask(() => {
  console.log('Microtask callback');
});
```

## 5. 实际示例对比

让我们通过一个更复杂的例子来展示差异：

```javascript
// 浏览器环境下的执行顺序
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  return Promise.resolve();
}).then(() => {
  console.log('4');
});

queueMicrotask(() => console.log('5'));

console.log('6');

// 浏览器输出：1 -> 6 -> 3 -> 5 -> 4 -> 2
```

```javascript
// Node.js 环境下的执行顺序
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  return Promise.resolve();
}).then(() => {
  console.log('4');
});

process.nextTick(() => console.log('5'));

setImmediate(() => console.log('6'));

console.log('7');

// Node.js 输出：1 -> 7 -> 5 -> 3 -> 4 -> 2 -> 6
```

## 6. 性能和优化差异

### 浏览器中的优化
```javascript
// 浏览器会优化连续的微任务
function scheduleTasks() {
  // 浏览器可能会批量处理这些任务
  Promise.resolve().then(() => console.log('Task 1'));
  Promise.resolve().then(() => console.log('Task 2'));
  Promise.resolve().then(() => console.log('Task 3'));
}
```

### Node.js 中的优化
```javascript
// Node.js 对 nextTick 有特殊处理
function recursiveNextTick() {
  console.log('Recursive task');
  // Node.js 会限制 nextTick 的递归调用以防止阻塞
  process.nextTick(recursiveNextTick);
}

// Node.js 有 nextTick 队列深度限制（默认 1000）
```

## 总结

主要区别包括：

1. **阶段复杂度**：Node.js 有明确的 6 个阶段，而浏览器相对简单
2. **微任务优先级**：Node.js 中 `process.nextTick` 优先级高于 Promise
3. **API 差异**：各有特有的 API，如浏览器的 `requestAnimationFrame` 和 Node.js 的 `setImmediate`
4. **执行顺序**：相同代码在两种环境下的执行顺序可能不同
5. **优化策略**：各有不同的性能优化机制

理解这些差异对于编写跨平台的 JavaScript 代码非常重要。