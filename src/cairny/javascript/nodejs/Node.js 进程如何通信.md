---
title: Node.js 进程如何通信
---

Node.js 进程间通信（IPC - Inter-Process Communication）有多种方式，每种方式适用于不同的场景。让我详细介绍主要的通信方式：

## 1. 使用 child_process 模块

### spawn 方式通信

```javascript
// parent.js - 父进程
const { spawn } = require('child_process');
const path = require('path');

// 启动子进程
const child = spawn('node', [path.join(__dirname, 'child.js')]);

// 向子进程发送消息
child.stdin.write(JSON.stringify({ type: 'greeting', message: 'Hello Child!' }) + '\n');

// 接收子进程的消息
child.stdout.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString().trim());
    console.log('从子进程收到:', message);
  } catch (err) {
    console.log('子进程输出:', data.toString());
  }
});

// 处理错误
child.stderr.on('data', (data) => {
  console.error('子进程错误:', data.toString());
});

// 子进程退出处理
child.on('exit', (code) => {
  console.log(`子进程退出，退出码: ${code}`);
});
```

```javascript
// child.js - 子进程
const readline = require('readline');

// 创建 readline 接口读取 stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 监听父进程的消息
rl.on('line', (input) => {
  try {
    const message = JSON.parse(input);
    console.log('子进程收到:', message);
    
    // 回复父进程
    process.stdout.write(JSON.stringify({
      type: 'response',
      message: 'Hello Parent!',
      timestamp: Date.now()
    }) + '\n');
  } catch (err) {
    console.log('收到:', input);
  }
});

// 发送初始化消息
process.stdout.write(JSON.stringify({
  type: 'ready',
  pid: process.pid
}) + '\n');
```

### fork 方式通信（推荐）

```javascript
// master.js - 主进程
const { fork } = require('child_process');
const path = require('path');

// fork 子进程（自动建立 IPC 通道）
const worker = fork(path.join(__dirname, 'worker.js'));

// 向子进程发送消息
worker.send({
  type: 'start',
  data: { taskId: 1, taskName: '数据处理' }
});

// 接收子进程消息
worker.on('message', (message) => {
  switch (message.type) {
    case 'progress':
      console.log(`任务进度: ${message.progress}%`);
      break;
    case 'result':
      console.log('任务完成:', message.result);
      break;
    case 'error':
      console.error('子进程错误:', message.error);
      break;
    default:
      console.log('收到未知消息:', message);
  }
});

// 子进程退出处理
worker.on('exit', (code) => {
  console.log(`子进程退出，退出码: ${code}`);
});

// 子进程错误处理
worker.on('error', (err) => {
  console.error('子进程启动错误:', err);
});
```

```javascript
// worker.js - 工作进程
const { parentPort } = require('worker_threads'); // 注意：在 fork 中不需要这个

// 接收主进程消息
process.on('message', async (message) => {
  console.log('工作进程收到:', message);
  
  switch (message.type) {
    case 'start':
      await processTask(message.data);
      break;
    default:
      console.log('未知命令:', message.type);
  }
});

// 模拟任务处理
async function processTask(taskData) {
  try {
    // 发送进度更新
    process.send({
      type: 'progress',
      progress: 0
    });
    
    // 模拟耗时操作
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      process.send({
        type: 'progress',
        progress: i * 10
      });
    }
    
    // 发送结果
    process.send({
      type: 'result',
      result: {
        taskId: taskData.taskId,
        status: 'completed',
        data: [1, 2, 3, 4, 5]
      }
    });
  } catch (error) {
    process.send({
      type: 'error',
      error: error.message
    });
  }
}

// 发送就绪信号
process.send({
  type: 'ready',
  pid: process.pid
});
```

## 2. 使用 Worker Threads

### 基本 Worker 通信

```javascript
// main.js - 主线程
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');

if (isMainThread) {
  // 主线程
  console.log('主线程 PID:', process.pid);
  
  // 创建 Worker
  const worker = new Worker(__filename, {
    workerData: { taskId: 1, taskName: '计算任务' }
  });
  
  // 接收 Worker 消息
  worker.on('message', (message) => {
    console.log('主线程收到:', message);
  });
  
  // Worker 错误处理
  worker.on('error', (err) => {
    console.error('Worker 错误:', err);
  });
  
  // Worker 退出处理
  worker.on('exit', (code) => {
    console.log(`Worker 退出，退出码: ${code}`);
  });
  
  // 向 Worker 发送消息
  worker.postMessage({
    type: 'calculate',
    numbers: [1, 2, 3, 4, 5]
  });
} else {
  // Worker 线程
  console.log('Worker 线程 ID:', workerData.taskId);
  
  // 接收主线程消息
  parentPort.on('message', (message) => {
    console.log('Worker 收到:', message);
    
    switch (message.type) {
      case 'calculate':
        const sum = message.numbers.reduce((a, b) => a + b, 0);
        parentPort.postMessage({
          type: 'result',
          taskId: workerData.taskId,
          sum: sum,
          timestamp: Date.now()
        });
        break;
    }
  });
  
  // 发送初始化消息
  parentPort.postMessage({
    type: 'ready',
    workerId: workerData.taskId
  });
}
```

### 复杂 Worker 通信示例

```javascript
// calculator.js - 计算服务 Worker
const { parentPort, workerData } = require('worker_threads');

class CalculatorWorker {
  constructor() {
    this.operations = {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      divide: (a, b) => b !== 0 ? a / b : null
    };
    
    this.setupMessageHandler();
  }
  
  setupMessageHandler() {
    parentPort.on('message', (message) => {
      this.handleMessage(message);
    });
  }
  
  async handleMessage(message) {
    try {
      switch (message.type) {
        case 'calculate':
          const result = this.performCalculation(message.operation, message.operands);
          parentPort.postMessage({
            type: 'result',
            id: message.id,
            result: result,
            timestamp: Date.now()
          });
          break;
          
        case 'batchCalculate':
          const results = await this.batchCalculate(message.operations);
          parentPort.postMessage({
            type: 'batchResult',
            id: message.id,
            results: results
          });
          break;
          
        default:
          parentPort.postMessage({
            type: 'error',
            id: message.id,
            error: `未知操作类型: ${message.type}`
          });
      }
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        id: message.id,
        error: error.message
      });
    }
  }
  
  performCalculation(operation, operands) {
    if (!this.operations[operation]) {
      throw new Error(`不支持的操作: ${operation}`);
    }
    
    return this.operations[operation](...operands);
  }
  
  async batchCalculate(operations) {
    const results = [];
    
    for (const op of operations) {
      try {
        const result = this.performCalculation(op.operation, op.operands);
        results.push({
          id: op.id,
          result: result,
          success: true
        });
      } catch (error) {
        results.push({
          id: op.id,
          error: error.message,
          success: false
        });
      }
      
      // 模拟异步处理延迟
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return results;
  }
}

// 启动 Worker
new CalculatorWorker();

parentPort.postMessage({
  type: 'initialized',
  pid: process.pid,
  workerId: workerData?.workerId || 'unknown'
});
```

```javascript
// main-worker.js - 使用计算器 Worker
const { Worker } = require('worker_threads');
const path = require('path');

class CalculatorService {
  constructor() {
    this.workers = new Map();
    this.requestCounter = 0;
  }
  
  async createWorker(workerId) {
    const worker = new Worker(path.join(__dirname, 'calculator.js'), {
      workerData: { workerId }
    });
    
    // 等待 Worker 初始化完成
    const readyPromise = new Promise((resolve) => {
      worker.once('message', (message) => {
        if (message.type === 'initialized') {
          resolve(worker);
        }
      });
    });
    
    this.workers.set(workerId, worker);
    return readyPromise;
  }
  
  async calculate(workerId, operation, operands) {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} 不存在`);
    }
    
    const requestId = ++this.requestCounter;
    
    // 发送计算请求
    worker.postMessage({
      type: 'calculate',
      id: requestId,
      operation,
      operands
    });
    
    // 等待计算结果
    return new Promise((resolve, reject) => {
      const handleMessage = (message) => {
        if (message.id === requestId) {
          worker.removeListener('message', handleMessage);
          
          if (message.type === 'result') {
            resolve(message.result);
          } else if (message.type === 'error') {
            reject(new Error(message.error));
          }
        }
      };
      
      worker.on('message', handleMessage);
    });
  }
  
  terminateWorker(workerId) {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.terminate();
      this.workers.delete(workerId);
    }
  }
}

// 使用示例
async function main() {
  const calculator = new CalculatorService();
  
  try {
    // 创建 Worker
    const worker = await calculator.createWorker('calc1');
    console.log('Worker 创建成功');
    
    // 执行计算
    const result1 = await calculator.calculate('calc1', 'add', [10, 5]);
    console.log('加法结果:', result1);
    
    const result2 = await calculator.calculate('calc1', 'multiply', [3, 4]);
    console.log('乘法结果:', result2);
    
  } catch (error) {
    console.error('计算错误:', error);
  } finally {
    // 清理资源
    calculator.terminateWorker('calc1');
  }
}

main();
```

## 3. 使用 TCP Socket 通信

```javascript
// server.js - TCP 服务器
const net = require('net');

class TCPServer {
  constructor(port) {
    this.port = port;
    this.clients = new Set();
    this.createServer();
  }
  
  createServer() {
    this.server = net.createServer((socket) => {
      console.log(`客户端连接: ${socket.remoteAddress}:${socket.remotePort}`);
      this.clients.add(socket);
      
      socket.on('data', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('收到消息:', message);
          
          // 处理消息并回复
          this.handleMessage(socket, message);
        } catch (error) {
          console.error('解析消息错误:', error);
          socket.write(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
      
      socket.on('close', () => {
        console.log('客户端断开连接');
        this.clients.delete(socket);
      });
      
      socket.on('error', (err) => {
        console.error('Socket 错误:', err);
        this.clients.delete(socket);
      });
      
      // 发送欢迎消息
      socket.write(JSON.stringify({
        type: 'welcome',
        message: '连接成功',
        serverTime: new Date().toISOString()
      }));
    });
    
    this.server.listen(this.port, () => {
      console.log(`TCP 服务器运行在端口 ${this.port}`);
    });
  }
  
  handleMessage(socket, message) {
    switch (message.type) {
      case 'echo':
        socket.write(JSON.stringify({
          type: 'echo',
          original: message.data,
          timestamp: Date.now()
        }));
        break;
        
      case 'broadcast':
        this.broadcast(message, socket);
        break;
        
      case 'ping':
        socket.write(JSON.stringify({
          type: 'pong',
          timestamp: Date.now()
        }));
        break;
        
      default:
        socket.write(JSON.stringify({
          type: 'error',
          message: `未知消息类型: ${message.type}`
        }));
    }
  }
  
  broadcast(message, excludeSocket) {
    const broadcastMessage = JSON.stringify({
      type: 'broadcast',
      from: message.from,
      data: message.data,
      timestamp: Date.now()
    });
    
    for (const client of this.clients) {
      if (client !== excludeSocket) {
        client.write(broadcastMessage);
      }
    }
  }
  
  close() {
    this.server.close();
    for (const client of this.clients) {
      client.destroy();
    }
  }
}

// 启动服务器
const server = new TCPServer(8080);

// 优雅关闭
process.on('SIGINT', () => {
  console.log('关闭服务器...');
  server.close();
  process.exit(0);
});
```

```javascript
// client.js - TCP 客户端
const net = require('net');

class TCPClient {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = null;
    this.messageHandlers = new Map();
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.port, this.host, () => {
        console.log('连接服务器成功');
        resolve();
      });
      
      this.socket.on('data', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('解析服务器消息错误:', error);
        }
      });
      
      this.socket.on('close', () => {
        console.log('与服务器断开连接');
      });
      
      this.socket.on('error', (err) => {
        console.error('连接错误:', err);
        reject(err);
      });
    });
  }
  
  sendMessage(message) {
    if (!this.socket || this.socket.destroyed) {
      throw new Error('未连接到服务器');
    }
    
    this.socket.write(JSON.stringify(message));
  }
  
  handleMessage(message) {
    console.log('收到服务器消息:', message);
    
    // 触发对应的处理器
    if (this.messageHandlers.has(message.type)) {
      this.messageHandlers.get(message.type)(message);
    }
  }
  
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }
  
  close() {
    if (this.socket) {
      this.socket.destroy();
    }
  }
}

// 使用示例
async function main() {
  const client = new TCPClient('localhost', 8080);
  
  try {
    await client.connect();
    
    // 注册消息处理器
    client.onMessage('welcome', (message) => {
      console.log('欢迎消息:', message.message);
    });
    
    client.onMessage('echo', (message) => {
      console.log('回显消息:', message.original);
    });
    
    client.onMessage('pong', (message) => {
      console.log('Ping 响应:', message.timestamp);
    });
    
    // 发送测试消息
    client.sendMessage({
      type: 'echo',
      data: 'Hello Server!'
    });
    
    client.sendMessage({
      type: 'ping'
    });
    
    // 保持连接一段时间
    setTimeout(() => {
      client.close();
    }, 5000);
    
  } catch (error) {
    console.error('客户端错误:', error);
  }
}

main();
```

## 4. 使用 HTTP/HTTPS 通信

```javascript
// http-server.js - HTTP 服务进程
const http = require('http');
const url = require('url');

class HTTPServer {
  constructor(port) {
    this.port = port;
    this.createServer();
  }
  
  createServer() {
    this.server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const method = req.method;
      
      console.log(`${method} ${pathname}`);
      
      // 设置 CORS 头
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // 解析请求体
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const requestData = body ? JSON.parse(body) : {};
          this.handleRequest(req, res, pathname, method, requestData, parsedUrl.query);
        } catch (error) {
          this.sendError(res, 400, 'Invalid JSON');
        }
      });
    });
    
    this.server.listen(this.port, () => {
      console.log(`HTTP 服务器运行在端口 ${this.port}`);
    });
  }
  
  handleRequest(req, res, pathname, method, data, query) {
    switch (pathname) {
      case '/echo':
        this.handleEcho(req, res, data);
        break;
        
      case '/calculate':
        this.handleCalculate(req, res, data);
        break;
        
      case '/status':
        this.handleStatus(req, res);
        break;
        
      default:
        this.sendError(res, 404, 'Not Found');
    }
  }
  
  handleEcho(req, res, data) {
    this.sendResponse(res, 200, {
      type: 'echo',
      original: data,
      timestamp: new Date().toISOString()
    });
  }
  
  handleCalculate(req, res, data) {
    try {
      const { operation, operands } = data;
      let result;
      
      switch (operation) {
        case 'add':
          result = operands.reduce((a, b) => a + b, 0);
          break;
        case 'multiply':
          result = operands.reduce((a, b) => a * b, 1);
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      
      this.sendResponse(res, 200, {
        operation,
        operands,
        result
      });
    } catch (error) {
      this.sendError(res, 400, error.message);
    }
  }
  
  handleStatus(req, res) {
    this.sendResponse(res, 200, {
      status: 'ok',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    });
  }
  
  sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  }
  
  sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }, null, 2));
  }
  
  close() {
    this.server.close();
  }
}

// 启动服务器
const server = new HTTPServer(3000);

process.on('SIGINT', () => {
  console.log('关闭 HTTP 服务器...');
  server.close();
  process.exit(0);
});
```

```javascript
// http-client.js - HTTP 客户端进程
const http = require('http');

class HTTPClient {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }
  
  async request(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.host,
        port: this.port,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: parsedData
            });
          } catch (error) {
            reject(new Error(`解析响应错误: ${error.message}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
  
  async echo(message) {
    return this.request('/echo', 'POST', { message });
  }
  
  async calculate(operation, operands) {
    return this.request('/calculate', 'POST', { operation, operands });
  }
  
  async getStatus() {
    return this.request('/status', 'GET');
  }
}

// 使用示例
async function main() {
  const client = new HTTPClient('localhost', 3000);
  
  try {
    // 测试 echo
    const echoResponse = await client.echo('Hello HTTP Server!');
    console.log('Echo 响应:', echoResponse.data);
    
    // 测试计算
    const calcResponse = await client.calculate('add', [1, 2, 3, 4, 5]);
    console.log('计算响应:', calcResponse.data);
    
    // 测试状态
    const statusResponse = await client.getStatus();
    console.log('状态响应:', statusResponse.data);
    
  } catch (error) {
    console.error('HTTP 客户端错误:', error);
  }
}

main();
```

## 5. 使用消息队列（Redis）

```javascript
// package.json 需要添加: "ioredis": "^5.0.0"

// redis-pubsub.js - 使用 Redis 发布/订阅
const Redis = require('ioredis');

class RedisPubSub {
  constructor(options = {}) {
    this.publisher = new Redis(options);
    this.subscriber = new Redis(options);
  }
  
  publish(channel, message) {
    return this.publisher.publish(channel, JSON.stringify(message));
  }
  
  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          console.error('解析消息错误:', error);
        }
      }
    });
  }
  
  async quit() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}

// producer.js - 消息生产者
async function producer() {
  const pubsub = new RedisPubSub();
  
  // 发送不同类型的消息
  setInterval(() => {
    const message = {
      type: 'notification',
      content: `通知消息 #${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now()
    };
    
    pubsub.publish('notifications', message);
    console.log('发送通知:', message.content);
  }, 2000);
  
  // 发送任务消息
  setTimeout(() => {
    const taskMessage = {
      type: 'task',
      taskId: 'task-' + Date.now(),
      action: 'processData',
      data: { items: [1, 2, 3, 4, 5] }
    };
    
    pubsub.publish('tasks', taskMessage);
    console.log('发送任务:', taskMessage.taskId);
  }, 1000);
  
  // 优雅关闭
  process.on('SIGINT', async () => {
    console.log('关闭生产者...');
    await pubsub.quit();
    process.exit(0);
  });
}

// consumer.js - 消息消费者
async function consumer() {
  const pubsub = new RedisPubSub();
  
  // 订阅通知
  pubsub.subscribe('notifications', (message) => {
    console.log('收到通知:', message.content);
  });
  
  // 订阅任务
  pubsub.subscribe('tasks', async (message) => {
    console.log('收到任务:', message.taskId);
    
    // 模拟任务处理
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`任务 ${message.taskId} 处理完成`);
  });
  
  console.log('消费者已启动，等待消息...');
  
  // 优雅关闭
  process.on('SIGINT', async () => {
    console.log('关闭消费者...');
    await pubsub.quit();
    process.exit(0);
  });
}

// 根据参数决定运行生产者还是消费者
if (process.argv[2] === 'producer') {
  producer();
} else if (process.argv[2] === 'consumer') {
  consumer();
} else {
  console.log('用法: node redis-pubsub.js [producer|consumer]');
}
```

## 总结

Node.js 进程间通信的主要方式：

1. **child_process.fork()** - 最常用，自动建立 IPC 通道
2. **Worker Threads** - 适合 CPU 密集型任务，共享内存
3. **TCP/UDP Socket** - 网络通信，跨机器通信
4. **HTTP/HTTPS** - 标准 Web 通信方式
5. **消息队列** - 如 Redis、RabbitMQ，适合解耦和异步通信
6. **Unix Domain Socket** - 同机高效通信
7. **共享文件/数据库** - 简单但效率较低

选择哪种方式取决于具体需求：
- 同一应用的子进程通信：推荐 `child_process.fork()`
- CPU 密集型任务：推荐 `Worker Threads`
- 跨网络通信：推荐 HTTP 或 TCP
- 异步解耦通信：推荐消息队列