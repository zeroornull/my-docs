---
title: Node中的EventEmitter
---

Node.js 中的 `EventEmitter` 是事件驱动编程的核心，让我详细讲解它的概念和实现。

## 1. EventEmitter 基本概念

### 什么是 EventEmitter？

`EventEmitter` 是 Node.js 中实现观察者模式的核心类，用于处理事件的发布和订阅。

```javascript
const EventEmitter = require('events');

// 创建 EventEmitter 实例
const emitter = new EventEmitter();

// 订阅事件
emitter.on('data', (data) => {
  console.log('收到数据:', data);
});

// 发布事件
emitter.emit('data', { message: 'Hello World' });
```

### 基本使用示例

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// 监听事件
myEmitter.on('event', () => {
  console.log('事件被触发！');
});

// 监听一次事件
myEmitter.once('event', () => {
  console.log('这个监听器只会执行一次');
});

// 发射事件
myEmitter.emit('event');
myEmitter.emit('event'); // 只有第一个监听器会再次执行

// 输出：
// 事件被触发！
// 这个监听器只会执行一次
// 事件被触发！
```

## 2. EventEmitter 核心方法

### 常用方法详解

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 1. on/addListener - 添加事件监听器
emitter.on('message', (data) => {
  console.log('on:', data);
});

emitter.addListener('message', (data) => {
  console.log('addListener:', data);
});

// 2. once - 添加一次性监听器
emitter.once('startup', () => {
  console.log('应用启动');
});

// 3. emit - 触发事件
emitter.emit('message', 'Hello');
emitter.emit('startup');
emitter.emit('startup'); // 不会再次触发

// 4. off/removeListener - 移除监听器
const listener = (data) => {
  console.log('动态监听器:', data);
};

emitter.on('dynamic', listener);
emitter.emit('dynamic', '第一次'); // 会触发
emitter.off('dynamic', listener);
emitter.emit('dynamic', '第二次'); // 不会触发

// 5. removeAllListeners - 移除所有监听器
emitter.on('test', () => console.log('test1'));
emitter.on('test', () => console.log('test2'));
emitter.removeAllListeners('test');
emitter.emit('test'); // 不会触发任何监听器

// 6. listenerCount - 获取监听器数量
emitter.on('count', () => {});
emitter.on('count', () => {});
console.log('count 事件监听器数量:', emitter.listenerCount('count')); // 2
```

### 事件参数传递

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('user-login', (userId, username, timestamp) => {
  console.log(`用户 ${username} (ID: ${userId}) 在 ${timestamp} 登录`);
});

emitter.on('data-update', (data) => {
  console.log('数据更新:', data);
});

// 触发事件并传递参数
emitter.emit('user-login', 123, '张三', new Date().toISOString());
emitter.emit('data-update', { id: 1, name: '产品A', price: 99.99 });
```

## 3. EventEmitter 高级特性

### 错误处理

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// ❌ 错误：未处理的错误事件会导致进程崩溃
// emitter.emit('error', new Error('Something went wrong'));

// ✅ 正确：监听 error 事件
emitter.on('error', (err) => {
  console.error('捕获到错误:', err.message);
});

emitter.emit('error', new Error('测试错误'));

// 使用 once 监听错误
emitter.once('error', (err) => {
  console.error('一次性错误处理:', err.message);
});
```

### 事件监听器限制

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 设置最大监听器数量（默认 10）
console.log('默认最大监听器数:', emitter.getMaxListeners()); // 10

emitter.setMaxListeners(20);
console.log('设置后最大监听器数:', emitter.getMaxListeners()); // 20

// 当监听器超过限制时会发出警告
for (let i = 0; i < 15; i++) {
  emitter.on('warning-test', () => {});
}
```

### 获取事件信息

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event1', () => {});
emitter.on('event1', () => {});
emitter.on('event2', () => {});

// 获取事件名称
console.log('事件名称:', emitter.eventNames()); // ['event1', 'event2']

// 获取特定事件的监听器
console.log('event1 监听器:', emitter.listeners('event1'));
console.log('event1 监听器数量:', emitter.listenerCount('event1')); // 2
```

## 4. 自定义 EventEmitter 实现

### 基础版本实现

```javascript
class SimpleEventEmitter {
  constructor() {
    this.events = {};
  }

  // 添加事件监听器
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    return this;
  }

  // 添加一次性监听器
  once(eventName, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(eventName, onceWrapper);
    };
    return this.on(eventName, onceWrapper);
  }

  // 移除事件监听器
  off(eventName, listener) {
    if (!this.events[eventName]) return this;
    
    this.events[eventName] = this.events[eventName].filter(
      (handler) => handler !== listener
    );
    return this;
  }

  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return false;
    
    this.events[eventName].forEach((listener) => {
      listener.apply(this, args);
    });
    
    return true;
  }

  // 获取监听器数量
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }

  // 移除所有监听器
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
    return this;
  }
}

// 测试基础实现
const simpleEmitter = new SimpleEventEmitter();

simpleEmitter.on('test', (data) => {
  console.log('基础实现 - 收到数据:', data);
});

simpleEmitter.once('once-test', () => {
  console.log('基础实现 - 一次性事件');
});

simpleEmitter.emit('test', 'Hello');
simpleEmitter.emit('once-test');
simpleEmitter.emit('once-test'); // 不会再次触发
```

### 完整版本实现

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
    this.maxListeners = 10;
  }

  // 设置最大监听器数量
  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
      throw new TypeError('n must be a positive number');
    }
    this.maxListeners = n;
    return this;
  }

  // 获取最大监听器数量
  getMaxListeners() {
    return this.maxListeners;
  }

  // 添加事件监听器
  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    // 检查监听器数量
    if (this.events[eventName].length >= this.maxListeners && this.maxListeners !== 0) {
      console.warn(`警告: ${eventName} 事件监听器数量超过限制 ${this.maxListeners}`);
    }

    this.events[eventName].push(listener);
    
    // 触发 newListener 事件
    if (this.events['newListener']) {
      this.emit('newListener', eventName, listener);
    }

    return this;
  }

  // 添加事件监听器（别名）
  addListener(eventName, listener) {
    return this.on(eventName, listener);
  }

  // 添加一次性监听器
  once(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const onceWrapper = (...args) => {
      this.off(eventName, onceWrapper);
      listener.apply(this, args);
    };

    // 保存原始监听器引用
    onceWrapper.listener = listener;
    
    return this.on(eventName, onceWrapper);
  }

  // 移除事件监听器
  off(eventName, listener) {
    if (!this.events[eventName]) return this;

    const listenerIndex = this.events[eventName].findIndex(
      (handler) => handler === listener || handler.listener === listener
    );

    if (listenerIndex !== -1) {
      const removedListener = this.events[eventName][listenerIndex];
      this.events[eventName].splice(listenerIndex, 1);
      
      // 触发 removeListener 事件
      if (this.events['removeListener']) {
        this.emit('removeListener', eventName, removedListener);
      }
    }

    return this;
  }

  // 移除事件监听器（别名）
  removeListener(eventName, listener) {
    return this.off(eventName, listener);
  }

  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      // 特殊处理 error 事件
      if (eventName === 'error') {
        let err = args[0];
        if (err instanceof Error) {
          throw err;
        } else {
          throw new Error(`Unhandled 'error' event: ${err}`);
        }
      }
      return false;
    }

    // 复制监听器数组，避免在执行过程中修改数组影响执行
    const listeners = this.events[eventName].slice();
    
    for (let i = 0; i < listeners.length; i++) {
      try {
        listeners[i].apply(this, args);
      } catch (error) {
        // 错误处理
        console.error('事件监听器执行出错:', error);
        if (eventName === 'error') {
          throw error;
        }
      }
    }

    return true;
  }

  // 获取监听器数量
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }

  // 获取事件名称
  eventNames() {
    return Object.keys(this.events);
  }

  // 获取特定事件的监听器
  listeners(eventName) {
    return this.events[eventName] ? this.events[eventName].slice() : [];
  }

  // 移除所有监听器
  removeAllListeners(eventName) {
    if (eventName) {
      if (this.events[eventName]) {
        const listeners = this.events[eventName];
        delete this.events[eventName];
        
        // 触发 removeListener 事件
        if (this.events['removeListener']) {
          listeners.forEach(listener => {
            this.emit('removeListener', eventName, listener);
          });
        }
      }
    } else {
      const eventNames = Object.keys(this.events);
      eventNames.forEach(name => {
        this.removeAllListeners(name);
      });
    }
    return this;
  }

  // 预置监听器
  prependListener(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].unshift(listener);
    
    if (this.events['newListener']) {
      this.emit('newListener', eventName, listener);
    }

    return this;
  }

  // 预置一次性监听器
  prependOnceListener(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const onceWrapper = (...args) => {
      this.off(eventName, onceWrapper);
      listener.apply(this, args);
    };

    onceWrapper.listener = listener;
    
    return this.prependListener(eventName, onceWrapper);
  }
}
```

## 5. 实际应用示例

### 自定义事件驱动类

```javascript
class DatabaseConnection extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  async connect() {
    try {
      // 模拟数据库连接
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.connected = true;
      this.emit('connected', this.config);
    } catch (error) {
      this.emit('error', error);
    }
  }

  async disconnect() {
    try {
      // 模拟断开连接
      await new Promise(resolve => setTimeout(resolve, 500));
      this.connected = false;
      this.emit('disconnected');
    } catch (error) {
      this.emit('error', error);
    }
  }

  async query(sql) {
    if (!this.connected) {
      throw new Error('数据库未连接');
    }

    this.emit('query', sql);
    
    try {
      // 模拟查询
      const result = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ rows: [], rowCount: 0 });
        }, Math.random() * 100);
      });
      
      this.emit('query-complete', sql, result);
      return result;
    } catch (error) {
      this.emit('query-error', sql, error);
      throw error;
    }
  }
}

// 使用示例
const db = new DatabaseConnection({ host: 'localhost', port: 5432 });

// 监听事件
db.on('connected', (config) => {
  console.log('数据库已连接:', config.host);
});

db.on('disconnected', () => {
  console.log('数据库已断开连接');
});

db.on('query', (sql) => {
  console.log('执行查询:', sql);
});

db.on('query-complete', (sql, result) => {
  console.log('查询完成:', sql, `返回 ${result.rowCount} 行`);
});

db.on('error', (error) => {
  console.error('数据库错误:', error.message);
});

// 使用数据库
(async () => {
  await db.connect();
  await db.query('SELECT * FROM users');
  await db.query('SELECT * FROM products');
  await db.disconnect();
})();
```

### 事件总线实现

```javascript
class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
    this.middleware = [];
  }

  // 添加中间件
  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError('Middleware must be a function');
    }
    this.middleware.push(middleware);
    return this;
  }

  // 发布事件（带中间件处理）
  async publish(eventName, data) {
    // 执行中间件
    let processedData = data;
    for (const middleware of this.middleware) {
      processedData = await middleware(eventName, processedData);
    }
    
    this.emitter.emit(eventName, processedData);
  }

  // 订阅事件
  subscribe(eventName, handler) {
    this.emitter.on(eventName, handler);
    return this;
  }

  // 取消订阅
  unsubscribe(eventName, handler) {
    this.emitter.off(eventName, handler);
    return this;
  }
}

// 使用事件总线
const eventBus = new EventBus();

// 添加中间件
eventBus.use(async (eventName, data) => {
  console.log(`处理事件: ${eventName}`);
  // 可以在这里添加日志、验证等逻辑
  return { ...data, timestamp: Date.now() };
});

// 订阅事件
eventBus.subscribe('user-created', (data) => {
  console.log('用户创建事件:', data);
});

eventBus.subscribe('order-placed', (data) => {
  console.log('订单创建事件:', data);
});

// 发布事件
eventBus.publish('user-created', { id: 1, name: '张三' });
eventBus.publish('order-placed', { userId: 1, amount: 99.99 });
```

### 流式数据处理

```javascript
class DataProcessor extends EventEmitter {
  constructor() {
    super();
    this.buffer = [];
    this.processing = false;
  }

  // 添加数据
  addData(data) {
    this.buffer.push(data);
    this.emit('data-added', data);
    this.process();
  }

  // 处理数据
  async process() {
    if (this.processing || this.buffer.length === 0) {
      return;
    }

    this.processing = true;
    this.emit('processing-start');

    try {
      while (this.buffer.length > 0) {
        const data = this.buffer.shift();
        
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.emit('data-processed', data);
      }
      
      this.emit('processing-complete');
    } catch (error) {
      this.emit('processing-error', error);
    } finally {
      this.processing = false;
    }
  }
}

// 使用数据处理器
const processor = new DataProcessor();

processor.on('data-added', (data) => {
  console.log('数据已添加:', data);
});

processor.on('processing-start', () => {
  console.log('开始处理数据');
});

processor.on('data-processed', (data) => {
  console.log('数据已处理:', data);
});

processor.on('processing-complete', () => {
  console.log('数据处理完成');
});

processor.on('processing-error', (error) => {
  console.error('处理错误:', error);
});

// 添加数据
processor.addData({ id: 1, value: '数据1' });
processor.addData({ id: 2, value: '数据2' });
processor.addData({ id: 3, value: '数据3' });
```

## 6. 性能优化和最佳实践

### 内存泄漏预防

```javascript
class SafeEventEmitter extends EventEmitter {
  constructor(options = {}) {
    super();
    this.maxListeners = options.maxListeners || 10;
    this.listenerCounts = new Map();
  }

  on(eventName, listener) {
    // 检查监听器数量
    const currentCount = this.listenerCounts.get(eventName) || 0;
    if (currentCount >= this.maxListeners) {
      console.warn(`警告: ${eventName} 事件监听器数量达到上限 ${this.maxListeners}`);
    }
    
    this.listenerCounts.set(eventName, currentCount + 1);
    return super.on(eventName, listener);
  }

  off(eventName, listener) {
    const currentCount = this.listenerCounts.get(eventName) || 0;
    if (currentCount > 0) {
      this.listenerCounts.set(eventName, currentCount - 1);
    }
    return super.off(eventName, listener);
  }

  // 自动清理无用监听器
  cleanup() {
    for (const [eventName, count] of this.listenerCounts) {
      if (count === 0 && this.events[eventName]) {
        delete this.events[eventName];
      }
    }
  }
}
```

### 事件节流和防抖

```javascript
class ThrottledEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.throttledEvents = new Map();
  }

  // 节流事件发射
  emitThrottled(eventName, data, delay = 1000) {
    const lastEmit = this.throttledEvents.get(eventName) || 0;
    const now = Date.now();
    
    if (now - lastEmit >= delay) {
      this.throttledEvents.set(eventName, now);
      return this.emit(eventName, data);
    }
    
    return false;
  }

  // 防抖事件发射
  emitDebounced(eventName, data, delay = 300) {
    if (this.debounceTimers) {
      clearTimeout(this.debounceTimers[eventName]);
    } else {
      this.debounceTimers = {};
    }

    this.debounceTimers[eventName] = setTimeout(() => {
      this.emit(eventName, data);
      delete this.debounceTimers[eventName];
    }, delay);
  }
}
```

## 总结

EventEmitter 的核心要点：

1. **基本概念**：实现观察者模式，用于事件的发布和订阅
2. **核心方法**：on、`once`、`emit`、off 等
3. **高级特性**：错误处理、监听器限制、事件信息获取
4. **自定义实现**：从简单到完整的不同版本实现
5. **实际应用**：数据库连接、事件总线、数据处理等场景
6. **最佳实践**：内存泄漏预防、性能优化、错误处理

通过合理使用 EventEmitter，可以构建松耦合、可扩展的事件驱动应用程序。