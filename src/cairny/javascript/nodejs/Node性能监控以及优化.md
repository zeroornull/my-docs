---
title: Node性能监控以及优化
---

Node.js 性能监控和优化是一个重要的话题。让我详细讲解如何监控和优化 Node.js 应用的性能。

## 1. 性能监控方法

### 内置监控工具

#### 使用 `console.time` 和 `console.timeEnd`
```javascript
// 简单的性能测量
console.time('Database Query');
// 执行数据库查询操作
await db.query('SELECT * FROM users');
console.timeEnd('Database Query');
```

#### Performance API
```javascript
const { PerformanceObserver, performance } = require('perf_hooks');

// 监控 HTTP 请求性能
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ['measure'] });

// 标记开始时间
performance.mark('start');
// 执行一些操作
await someAsyncOperation();
// 标记结束时间
performance.mark('end');

// 测量两个标记之间的时间
performance.measure('Operation Duration', 'start', 'end');
```

### 内存使用监控
```javascript
// 监控内存使用情况
function logMemoryUsage() {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

// 定期监控内存使用
setInterval(logMemoryUsage, 5000);
```

### CPU 使用率监控
```javascript
const os = require('os');

function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  
  cpus.forEach((cpu) => {
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  };
}
```

## 2. 第三方监控工具

### 使用 Clinic.js
```bash
# 安装 Clinic.js
npm install -g clinic

# 分析应用性能
clinic doctor -- node app.js
```

```javascript
// 示例应用代码
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/slow') {
    // 模拟慢操作
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
      result += Math.random();
    }
    res.end(`Result: ${result}`);
  } else {
    res.end('Hello World');
  }
});

server.listen(3000);
```

### 使用 0x 进行火焰图分析
```bash
# 安装 0x
npm install -g 0x

# 生成火焰图
0x app.js
```

## 3. 关键性能指标监控

### 响应时间监控
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
    
    // 记录慢请求
    if (duration > 1000) {
      console.warn(`Slow request detected: ${req.url} took ${duration}ms`);
    }
  });
  
  // 处理请求逻辑
  handleRequest(req, res);
});

function handleRequest(req, res) {
  // 模拟处理时间
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
  }, Math.random() * 100);
}
```

### 吞吐量监控
```javascript
let requestCount = 0;
let lastReportTime = Date.now();

// 每秒统计请求数
setInterval(() => {
  const now = Date.now();
  const duration = (now - lastReportTime) / 1000; // 秒
  const rps = requestCount / duration;
  
  console.log(`Requests per second: ${rps.toFixed(2)}`);
  
  requestCount = 0;
  lastReportTime = now;
}, 5000);

const server = http.createServer((req, res) => {
  requestCount++;
  // 处理请求...
});
```

## 4. 性能优化策略

### 异步操作优化
```javascript
// 避免阻塞事件循环
// ❌ 不好的做法
function blockingOperation() {
  let result = 0;
  for (let i = 0; i < 1e9; i++) {
    result += i;
  }
  return result;
}

// ✅ 好的做法 - 分批处理
async function nonBlockingOperation() {
  let result = 0;
  const total = 1e9;
  const batchSize = 1e6;
  
  for (let i = 0; i < total; i += batchSize) {
    await new Promise(resolve => {
      setImmediate(() => {
        const end = Math.min(i + batchSize, total);
        for (let j = i; j < end; j++) {
          result += j;
        }
        resolve();
      });
    });
  }
  
  return result;
}
```

### 缓存优化
```javascript
// 简单的内存缓存实现
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
  }
  
  set(key, value, ttl = 60000) { // 默认 60 秒
    this.cache.set(key, value);
    this.ttls.set(key, Date.now() + ttl);
  }
  
  get(key) {
    const ttl = this.ttls.get(key);
    if (ttl && Date.now() > ttl) {
      this.cache.delete(key);
      this.ttls.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }
  
  // 定期清理过期缓存
  cleanup() {
    const now = Date.now();
    for (const [key, ttl] of this.ttls) {
      if (now > ttl) {
        this.cache.delete(key);
        this.ttls.delete(key);
      }
    }
  }
}

const cache = new MemoryCache();
setInterval(() => cache.cleanup(), 30000); // 每30秒清理一次
```

### 数据库查询优化
```javascript
// 使用连接池优化数据库连接
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  connectionLimit: 10,
  queueLimit: 0
});

// 使用连接池执行查询
async function getUsers() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM users LIMIT 100');
    return rows;
  } finally {
    connection.release(); // 释放连接回池
  }
}

// 批量操作优化
async function batchInsert(users) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 批量插入而不是逐个插入
    const placeholders = users.map(() => '(?, ?)').join(',');
    const values = users.flatMap(user => [user.name, user.email]);
    
    await connection.execute(
      `INSERT INTO users (name, email) VALUES ${placeholders}`,
      values
    );
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

### 内存泄漏检测
```javascript
// 监控对象引用数量
const weakMap = new WeakMap();

function trackObject(obj, label) {
  weakMap.set(obj, { label, timestamp: Date.now() });
}

// 定期检查内存中的对象
function checkMemoryLeaks() {
  const activeObjects = [];
  // 注意：WeakMap 无法遍历，这里仅作示例
  console.log(`Tracked objects: ${activeObjects.length}`);
}

// 使用 weak references 避免内存泄漏
class EventEmitterWithWeakRefs extends require('events') {
  constructor() {
    super();
    this.listeners = new WeakMap();
  }
  
  addWeakListener(event, listener) {
    this.on(event, listener);
    this.listeners.set(listener, true);
  }
}
```

## 5. 使用专业监控工具

### Prometheus + Grafana 监控
```javascript
// 使用 prom-client 监控指标
const client = require('prom-client');

// 创建默认的收集器
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 自定义指标
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// 中间件记录指标
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    httpRequestDuration
      .labels(req.method, req.path, res.statusCode)
      .observe(duration / 1000);
      
    httpRequestsTotal
      .labels(req.method, req.path, res.statusCode)
      .inc();
  });
  
  next();
}
```

### 使用 PM2 进行监控
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=4096',
    env: {
      NODE_ENV: 'production',
    },
    // 启用监控
    monitor: true,
    // 自动重启配置
    max_restarts: 10,
    restart_delay: 4000,
  }]
};
```

## 6. 性能测试

### 压力测试示例
```javascript
// 使用 autocannon 进行压力测试
const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 100,
  duration: 20,
  pipelining: 1
}, console.log);

// 监听测试进度
instance.on('tick', () => {
  console.log('Test in progress...');
});

instance.on('done', (result) => {
  console.log('Test completed:', result);
});
```

## 总结

Node.js 性能监控和优化的关键点：

1. **监控工具**：使用内置 API 和第三方工具进行性能监控
2. **关键指标**：关注响应时间、吞吐量、内存使用和 CPU 使用率
3. **优化策略**：避免阻塞事件循环、合理使用缓存、优化数据库操作
4. **专业工具**：使用 Prometheus、Grafana、PM2 等专业监控工具
5. **定期测试**：进行压力测试和性能基准测试

通过系统的监控和优化，可以显著提升 Node.js 应用的性能和稳定性。