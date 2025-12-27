---
title: React 为什么不直接使用 requestIdleCallback
---

## React 中为什么不直接使用 requestIdleCallback

### 1. requestIdleCallback 基本概念

`requestIdleCallback` 是浏览器提供的 API，允许开发者在浏览器空闲时执行低优先级任务：

```javascript
// 基本用法
requestIdleCallback((deadline) => {
  // deadline.timeRemaining() 返回剩余时间
  // deadline.didTimeout 表示是否超时
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    performTask(tasks.shift());
  }
  
  // 如果还有任务，继续调度
  if (tasks.length > 0) {
    requestIdleCallback(doWork);
  }
});
```

### 2. React 不直接使用 requestIdleCallback 的原因

#### 2.1 浏览器兼容性问题

```javascript
// requestIdleCallback 在 Safari 中支持较晚，且性能不如 Chrome
// React 需要保证在所有浏览器中有一致的表现

// 检查浏览器支持
if (typeof requestIdleCallback !== 'function') {
  // 需要 polyfill 或替代方案
  window.requestIdleCallback = function(callback) {
    return setTimeout(() => {
      callback({
        timeRemaining: () => 1,
        didTimeout: false
      });
    }, 1);
  };
}
```

#### 2.2 时间控制不够精确

```javascript
// requestIdleCallback 的帧率限制问题
requestIdleCallback((deadline) => {
  console.log(deadline.timeRemaining()); // 通常只有几毫秒
  // 对于复杂的 React 更新任务，这点时间可能不够
}, { timeout: 500 });
```

#### 2.3 优先级调度需求

```javascript
// React 需要更细粒度的优先级控制
// requestIdleCallback 无法满足 React 的优先级需求

// React 的优先级系统
const priorities = {
  Immediate: 1,      // 立即执行
  UserBlocking: 2,   // 用户阻塞
  Normal: 3,         // 普通
  Low: 4,            // 低优先级
  Idle: 5            // 空闲时间
};

// requestIdleCallback 只能处理最低优先级的任务
```

### 3. React Scheduler 的解决方案

React 团队开发了自己的调度器（Scheduler）来替代 `requestIdleCallback`：

#### 3.1 自定义实现的优势

```javascript
// React Scheduler 的简化版本概念
class Scheduler {
  constructor() {
    this.tasks = [];
    this.isPerformingWork = false;
    this.scheduledHostCallback = null;
  }
  
  // 更精确的时间控制
  getCurrentTime() {
    return performance.now();
  }
  
  // 自定义优先级调度
  scheduleCallback(priorityLevel, callback) {
    const currentTime = this.getCurrentTime();
    const startTime = currentTime;
    
    let timeout;
    switch (priorityLevel) {
      case 1: // Immediate
        timeout = -1;
        break;
      case 2: // UserBlocking
        timeout = 250;
        break;
      case 3: // Normal
        timeout = 5000;
        break;
      default:
        timeout = 10000;
    }
    
    const expirationTime = startTime + timeout;
    
    const newTask = {
      callback,
      priorityLevel,
      startTime,
      expirationTime,
      isQueued: true
    };
    
    this.tasks.push(newTask);
    this.requestHostCallback();
    
    return newTask;
  }
  
  requestHostCallback() {
    // 使用 postMessage 实现更及时的调度
    if (!this.scheduledHostCallback) {
      this.scheduledHostCallback = true;
      this.schedulePerformWorkUntilDeadline();
    }
  }
}
```

#### 3.2 更好的浏览器兼容性

```javascript
// Scheduler 兼容性处理
let scheduleCallback;

// 优先使用原生 API
if (typeof requestIdleCallback !== 'undefined') {
  scheduleCallback = requestIdleCallback;
} else {
  // 回退到自定义实现
  scheduleCallback = function(callback) {
    return setTimeout(() => {
      callback({
        timeRemaining: () => Math.max(0, 50 - ((performance.now() - start) | 0)),
        didTimeout: false
      });
    }, 1);
  };
}

// React 实际使用 MessageChannel 实现更精确的控制
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
```

### 4. React Scheduler 与 requestIdleCallback 的对比

#### 4.1 时间精度对比

```javascript
// requestIdleCallback 精度限制
requestIdleCallback((deadline) => {
  // 通常只有 1-2ms 的时间
  console.log('可用时间:', deadline.timeRemaining());
});

// React Scheduler 更精确的控制
function workLoop(deadline) {
  // 可以更灵活地控制时间分配
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
}
```

#### 4.2 优先级控制对比

```javascript
// requestIdleCallback 无法处理优先级
requestIdleCallback(() => {
  // 所有任务都被视为低优先级
});

// React Scheduler 支持多优先级
import { unstable_scheduleCallback as scheduleCallback } from 'scheduler';

// 高优先级任务
scheduleCallback(1, () => {
  console.log('高优先级任务');
});

// 低优先级任务
scheduleCallback(5, () => {
  console.log('低优先级任务');
});
```

### 5. 实际应用示例

#### 5.1 React 内部调度机制

```javascript
// React 内部如何使用 Scheduler
import { unstable_scheduleCallback, unstable_NormalPriority } from 'scheduler';

function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  // ... 其他逻辑
  
  // 调度更新
  ensureRootIsScheduled(root, eventTime);
}

function ensureRootIsScheduled(root, currentTime) {
  // 根据优先级调度任务
  const newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
  
  root.callbackNode = newCallbackNode;
}
```

#### 5.2 用户自定义任务调度

```javascript
import { unstable_scheduleCallback, unstable_LowPriority } from 'scheduler';

// 使用 React Scheduler 调度低优先级任务
function scheduleDeferredTask(task) {
  unstable_scheduleCallback(unstable_LowPriority, task);
}

// 比使用原生 requestIdleCallback 更可靠
function scheduleDeferredTaskNative(task) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(task);
  } else {
    setTimeout(task, 1);
  }
}
```

### 6. 性能和可靠性优势

#### 6.1 更好的性能表现

```javascript
// Scheduler 的优化
const frameYieldMs = 5; // 可配置的帧时间

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameYieldMs) {
    return false;
  }
  
  // 更智能的让步策略
  return true;
}
```

#### 6.2 更可靠的调度

```javascript
// 处理浏览器标签页切换等场景
let isMessageLoopRunning = false;
let scheduledHostCallback = null;

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = function(event) {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // 检查是否应该执行任务
    const hasTimeRemaining = true;
    try {
      const continuationCallback = scheduledHostCallback(hasTimeRemaining, currentTime);
      if (continuationCallback !== null) {
        scheduledHostCallback = continuationCallback;
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    } catch (error) {
      port.postMessage(null);
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
};
```

### 7. 总结

React 不直接使用 `requestIdleCallback` 的主要原因包括：

1. **浏览器兼容性**：Safari 等浏览器支持较晚或性能不佳
2. **时间控制精度**：需要更精确的时间管理和控制
3. **优先级调度**：需要支持多种优先级的任务调度
4. **性能优化**：自定义实现可以更好地优化性能
5. **功能扩展**：需要支持 React 特有的调度需求

通过自研的 Scheduler，React 获得了更好的跨浏览器一致性、更精确的时间控制和更灵活的优先级调度能力，这些都是原生 `requestIdleCallback` 无法提供的。