---
title: Node 中的 Stream
---

Node.js 中的 Stream 是处理流式数据的核心机制，让我详细讲解 Stream 的概念、类型和应用场景。

## 1. Stream 基本概念

### 什么是 Stream？

Stream 是 Node.js 中处理流式数据的抽象接口，允许我们逐步处理数据而不是一次性加载到内存中。

```javascript
const fs = require('fs');

// ❌ 不好的做法：一次性读取整个文件
const data = fs.readFileSync('large-file.txt');
console.log(data.toString());

// ✅ 好的做法：使用流逐步处理
const readStream = fs.createReadStream('large-file.txt');
readStream.on('data', (chunk) => {
  console.log('接收到数据块:', chunk.length, '字节');
});
readStream.on('end', () => {
  console.log('文件读取完成');
});
```

### Stream 的核心特性

```javascript
const { Readable, Writable, Transform } = require('stream');

// 1. 内存效率：只处理当前数据块
// 2. 时间效率：边读边处理，无需等待全部数据
// 3. 可组合性：可以连接多个流
// 4. 背压处理：自动处理数据流速不匹配

// 流的背压示例
const readable = new Readable({
  read() {
    // 模拟快速生产数据
    for (let i = 0; i < 1000; i++) {
      this.push(`数据 ${i}\n`);
    }
    this.push(null); // 结束流
  }
});

const writable = new Writable({
  write(chunk, encoding, callback) {
    // 模拟慢速消费数据
    setTimeout(() => {
      console.log('写入:', chunk.toString().trim());
      callback();
    }, 100); // 故意延迟
  }
});

// 背压会自动处理，readable 会暂停生产数据
readable.pipe(writable);
```

## 2. Stream 的四种类型

### Readable Stream（可读流）

```javascript
const { Readable } = require('stream');

// 1. 流式读取数据
class NumberStream extends Readable {
  constructor(options) {
    super(options);
    this.current = 0;
    this.max = options.max || 100;
  }

  _read() {
    if (this.current <= this.max) {
      const number = this.current++;
      this.push(number.toString());
    } else {
      this.push(null); // 结束流
    }
  }
}

const numberStream = new NumberStream({ max: 10 });
numberStream.on('data', (chunk) => {
  console.log('读取到:', chunk.toString());
});

// 2. 从数组创建可读流
function createArrayStream(array) {
  return new Readable({
    objectMode: true, // 对象模式
    read() {
      if (array.length > 0) {
        this.push(array.shift());
      } else {
        this.push(null);
      }
    }
  });
}

const arrayStream = createArrayStream([1, 2, 3, 4, 5]);
arrayStream.on('data', (data) => {
  console.log('数组元素:', data);
});
```

### Writable Stream（可写流）

```javascript
const { Writable } = require('stream');

// 1. 基本可写流
class LoggerStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log('[LOG]', chunk.toString());
    callback(); // 必须调用回调
  }
}

const logger = new LoggerStream();
logger.write('第一条日志');
logger.write('第二条日志');
logger.end(); // 结束流

// 2. 对象模式的可写流
class DatabaseStream extends Writable {
  constructor(options = {}) {
    super({ objectMode: true });
    this.batchSize = options.batchSize || 5;
    this.buffer = [];
  }

  _write(chunk, encoding, callback) {
    this.buffer.push(chunk);
    
    if (this.buffer.length >= this.batchSize) {
      this.flush(callback);
    } else {
      callback();
    }
  }

  _final(callback) {
    // 流结束时处理剩余数据
    if (this.buffer.length > 0) {
      this.flush(callback);
    } else {
      callback();
    }
  }

  flush(callback) {
    console.log('批量插入数据:', this.buffer);
    // 模拟数据库插入
    setTimeout(() => {
      this.buffer = [];
      callback();
    }, 100);
  }
}

const dbStream = new DatabaseStream({ batchSize: 3 });
for (let i = 1; i <= 10; i++) {
  dbStream.write({ id: i, name: `用户${i}` });
}
dbStream.end();
```

### Duplex Stream（双工流）

```javascript
const { Duplex } = require('stream');

// 可读可写的流
class EchoStream extends Duplex {
  constructor(options) {
    super(options);
    this.data = [];
  }

  // 实现可写流的 _write 方法
  _write(chunk, encoding, callback) {
    console.log('接收到数据:', chunk.toString());
    this.data.push(chunk);
    callback();
  }

  // 实现可读流的 _read 方法
  _read() {
    if (this.data.length > 0) {
      this.push(this.data.shift());
    } else {
      // 不立即推送 null，等待更多数据
    }
  }
}

const echo = new EchoStream();
echo.write('Hello');
echo.write('World');

echo.on('data', (chunk) => {
  console.log('回显:', chunk.toString());
});

// 手动触发读取
setTimeout(() => {
  echo.read(); // 读取 'Hello'
  echo.read(); // 读取 'World'
}, 100);
```

### Transform Stream（转换流）

```javascript
const { Transform } = require('stream');

// 数据转换流
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // 转换数据
    const upperCaseData = chunk.toString().toUpperCase();
    callback(null, upperCaseData);
  }
}

class JSONTransform extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    try {
      const obj = JSON.parse(chunk.toString());
      callback(null, obj);
    } catch (error) {
      callback(error);
    }
  }
}

// 使用转换流
const upperCase = new UpperCaseTransform();
upperCase.on('data', (chunk) => {
  console.log('转换后:', chunk.toString());
});

upperCase.write('hello world');
upperCase.write('node.js stream');
upperCase.end();

// JSON 解析流
const jsonParser = new JSONTransform();
jsonParser.on('data', (obj) => {
  console.log('解析的 JSON:', obj);
});

jsonParser.write('{"name": "张三", "age": 25}');
jsonParser.write('{"name": "李四", "age": 30}');
jsonParser.end();
```

## 3. Stream 核心方法和事件

### 基本操作

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

// 1. 事件监听
const readStream = fs.createReadStream('input.txt');

readStream.on('data', (chunk) => {
  console.log('数据块大小:', chunk.length);
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('error', (error) => {
  console.error('读取错误:', error);
});

readStream.on('close', () => {
  console.log('流已关闭');
});

// 2. 流的控制方法
const writeStream = fs.createWriteStream('output.txt');

// 暂停和恢复
readStream.pause();
setTimeout(() => {
  readStream.resume();
}, 1000);

// 检查流状态
console.log('可读:', readStream.readable);
console.log('可写:', writeStream.writable);

// 3. pipe 方法
readStream.pipe(writeStream);

// 4. pipeline 方法（推荐）
pipeline(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) {
      console.error('管道错误:', err);
    } else {
      console.log('管道完成');
    }
  }
);
```

### 流的背压处理

```javascript
const { Readable, Writable } = require('stream');

// 模拟生产者和消费者速度不匹配
const fastProducer = new Readable({
  read() {
    // 快速生产数据
    for (let i = 0; i < 100; i++) {
      const shouldContinue = this.push(`数据 ${i}\n`);
      if (!shouldContinue) break; // 背压控制
    }
    if (this.readableLength > 1000) {
      this.push(null); // 停止生产
    }
  }
});

const slowConsumer = new Writable({
  write(chunk, encoding, callback) {
    // 慢速消费数据
    console.log('消费:', chunk.toString().trim());
    setTimeout(callback, 100); // 模拟慢速处理
  }
});

// 背压会自动处理
fastProducer.pipe(slowConsumer);

// 手动处理背压
fastProducer.on('data', (chunk) => {
  const shouldContinue = slowConsumer.write(chunk);
  
  if (!shouldContinue) {
    console.log('暂停生产');
    fastProducer.pause();
    
    slowConsumer.once('drain', () => {
      console.log('恢复生产');
      fastProducer.resume();
    });
  }
});
```

## 4. 实际应用场景

### 文件处理

```javascript
const fs = require('fs');
const { Transform, pipeline } = require('stream');
const { createGzip } = require('zlib');

// 1. 文件压缩
function compressFile(inputFile, outputFile) {
  const readStream = fs.createReadStream(inputFile);
  const gzip = createGzip();
  const writeStream = fs.createWriteStream(outputFile);

  pipeline(readStream, gzip, writeStream, (err) => {
    if (err) {
      console.error('压缩失败:', err);
    } else {
      console.log('压缩完成');
    }
  });
}

// 2. 大文件行处理
class LineProcessor extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    
    // 保留最后一行（可能不完整）
    this.buffer = lines.pop();
    
    lines.forEach(line => {
      if (line.trim()) {
        this.push(line.trim());
      }
    });
    
    callback();
  }

  _flush(callback) {
    // 处理剩余数据
    if (this.buffer.trim()) {
      this.push(this.buffer.trim());
    }
    callback();
  }
}

// 处理大日志文件
pipeline(
  fs.createReadStream('large-log.txt'),
  new LineProcessor(),
  new Writable({
    objectMode: true,
    write(line, encoding, callback) {
      // 处理每一行日志
      console.log('处理日志行:', line.substring(0, 50) + '...');
      callback();
    }
  }),
  (err) => {
    if (err) {
      console.error('处理失败:', err);
    } else {
      console.log('处理完成');
    }
  }
);
```

### HTTP 流处理

```javascript
const http = require('http');
const fs = require('fs');
const { Transform } = require('stream');

// 1. 流式文件下载
const server = http.createServer((req, res) => {
  if (req.url === '/download') {
    const filename = 'large-file.zip';
    const stat = fs.statSync(filename);
    
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    
    const readStream = fs.createReadStream(filename);
    readStream.pipe(res);
    
    readStream.on('error', (err) => {
      res.writeHead(500);
      res.end('服务器错误');
    });
  }
});

// 2. 流式文件上传处理
const server2 = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const writeStream = fs.createWriteStream('uploaded-file');
    
    req.pipe(writeStream);
    
    writeStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('文件上传成功');
    });
    
    writeStream.on('error', (err) => {
      res.writeHead(500);
      res.end('上传失败');
    });
  }
});

// 3. 数据转换中间件
class DataSanitizer extends Transform {
  _transform(chunk, encoding, callback) {
    // 清理和验证数据
    const cleanData = chunk.toString()
      .replace(/[<>]/g, '') // 移除潜在的 XSS 字符
      .trim();
    
    callback(null, cleanData);
  }
}

const server3 = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/data') {
    pipeline(
      req,
      new DataSanitizer(),
      new Writable({
        write(chunk, encoding, callback) {
          console.log('接收到清理后的数据:', chunk.toString());
          callback();
        }
      }),
      (err) => {
        if (err) {
          res.writeHead(400);
          res.end('数据处理失败');
        } else {
          res.writeHead(200);
          res.end('数据处理成功');
        }
      }
    );
  }
});
```

### 数据库流处理

```javascript
const { Readable, Writable, Transform } = require('stream');

// 1. 数据库查询结果流
class DatabaseQueryStream extends Readable {
  constructor(query, connection) {
    super({ objectMode: true });
    this.query = query;
    this.connection = connection;
    this.results = [];
    this.index = 0;
  }

  async _read() {
    try {
      if (this.results.length === 0) {
        // 模拟数据库查询
        this.results = await this.executeQuery();
      }

      if (this.index < this.results.length) {
        this.push(this.results[this.index++]);
      } else {
        this.push(null); // 结束流
      }
    } catch (error) {
      this.destroy(error);
    }
  }

  async executeQuery() {
    // 模拟数据库查询
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`
    }));
  }
}

// 2. 批量数据插入流
class BatchInsertStream extends Writable {
  constructor(options = {}) {
    super({ objectMode: true });
    this.batchSize = options.batchSize || 100;
    this.buffer = [];
    this.connection = options.connection;
  }

  async _write(chunk, encoding, callback) {
    this.buffer.push(chunk);
    
    if (this.buffer.length >= this.batchSize) {
      try {
        await this.flush();
        callback();
      } catch (error) {
        callback(error);
      }
    } else {
      callback();
    }
  }

  async _final(callback) {
    if (this.buffer.length > 0) {
      try {
        await this.flush();
        callback();
      } catch (error) {
        callback(error);
      }
    } else {
      callback();
    }
  }

  async flush() {
    console.log(`批量插入 ${this.buffer.length} 条记录`);
    // 模拟数据库批量插入
    await new Promise(resolve => setTimeout(resolve, 100));
    this.buffer = [];
  }
}

// 3. 数据处理管道
class UserProcessor extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(user, encoding, callback) {
    // 处理用户数据
    const processedUser = {
      ...user,
      fullName: user.name.toUpperCase(),
      createdAt: new Date().toISOString()
    };
    
    callback(null, processedUser);
  }
}

// 使用示例
async function processDataPipeline() {
  const queryStream = new DatabaseQueryStream('SELECT * FROM users');
  const processor = new UserProcessor();
  const insertStream = new BatchInsertStream({ batchSize: 50 });

  pipeline(
    queryStream,
    processor,
    insertStream,
    (err) => {
      if (err) {
        console.error('管道处理失败:', err);
      } else {
        console.log('数据处理完成');
      }
    }
  );
}

processDataPipeline();
```

### 实时数据处理

```javascript
const { Readable, Writable, Transform } = require('stream');

// 1. 实时传感器数据流
class SensorDataStream extends Readable {
  constructor(options) {
    super({ objectMode: true });
    this.interval = options.interval || 1000;
    this.timer = null;
  }

  _read() {
    this.timer = setInterval(() => {
      const data = {
        timestamp: Date.now(),
        temperature: Math.random() * 40, // 0-40°C
        humidity: Math.random() * 100,   // 0-100%
        pressure: 900 + Math.random() * 100 // 900-1000 hPa
      };
      
      this.push(data);
    }, this.interval);
  }

  _destroy(err, callback) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    callback(err);
  }
}

// 2. 数据分析和警报流
class DataAnalyzer extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.thresholds = options.thresholds || {
      temperature: { max: 35, min: 0 },
      humidity: { max: 80, min: 20 }
    };
  }

  _transform(data, encoding, callback) {
    // 分析数据并添加警报
    const alerts = [];
    
    if (data.temperature > this.thresholds.temperature.max) {
      alerts.push(`温度过高: ${data.temperature.toFixed(1)}°C`);
    }
    
    if (data.temperature < this.thresholds.temperature.min) {
      alerts.push(`温度过低: ${data.temperature.toFixed(1)}°C`);
    }
    
    if (data.humidity > this.thresholds.humidity.max) {
      alerts.push(`湿度过高: ${data.humidity.toFixed(1)}%`);
    }
    
    const analyzedData = {
      ...data,
      alerts,
      status: alerts.length > 0 ? 'WARNING' : 'NORMAL'
    };
    
    callback(null, analyzedData);
  }
}

// 3. 实时数据显示流
class ConsoleDisplay extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _write(data, encoding, callback) {
    const time = new Date(data.timestamp).toLocaleTimeString();
    const status = data.status === 'WARNING' ? '⚠️' : '✅';
    
    console.log(`${status} [${time}] 温度: ${data.temperature.toFixed(1)}°C, 湿度: ${data.humidity.toFixed(1)}%, 气压: ${data.pressure.toFixed(1)} hPa`);
    
    if (data.alerts.length > 0) {
      data.alerts.forEach(alert => {
        console.log(`   🚨 警报: ${alert}`);
      });
    }
    
    callback();
  }
}

// 4. 数据存储流
class DataLogger extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.buffer = [];
    this.batchSize = options.batchSize || 10;
  }

  _write(data, encoding, callback) {
    this.buffer.push(data);
    
    if (this.buffer.length >= this.batchSize) {
      this.flush(callback);
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.buffer.length > 0) {
      this.flush(callback);
    } else {
      callback();
    }
  }

  flush(callback) {
    // 模拟批量写入数据库或文件
    console.log(`存储 ${this.buffer.length} 条记录到数据库`);
    this.buffer = [];
    setTimeout(callback, 50);
  }
}

// 构建实时数据处理管道
function buildRealTimePipeline() {
  const sensorStream = new SensorDataStream({ interval: 2000 });
  const analyzer = new DataAnalyzer();
  const display = new ConsoleDisplay();
  const logger = new DataLogger({ batchSize: 5 });

  // 分叉流：同时显示和记录
  const { PassThrough } = require('stream');
  const tee = new PassThrough({ objectMode: true });

  sensorStream
    .pipe(analyzer)
    .pipe(tee);

  tee.pipe(display);
  tee.pipe(logger);

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n正在关闭传感器数据流...');
    sensorStream.destroy();
    logger.end(() => {
      console.log('数据记录完成');
      process.exit(0);
    });
  });
}

// 启动实时数据处理
buildRealTimePipeline();
```

## 5. 错误处理和最佳实践

### 错误处理

```javascript
const { pipeline } = require('stream');
const fs = require('fs');

// 1. 使用 pipeline 进行错误处理
pipeline(
  fs.createReadStream('input.txt'),
  // 可能出错的转换流
  new Transform({
    transform(chunk, encoding, callback) {
      if (Math.random() < 0.1) { // 10% 概率出错
        callback(new Error('随机错误'));
      } else {
        callback(null, chunk);
      }
    }
  }),
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) {
      console.error('管道错误:', err.message);
      // 清理资源
      if (err.code === 'ENOENT') {
        console.log('文件不存在');
      }
    } else {
      console.log('管道完成');
    }
  }
);

// 2. 自定义错误处理流
class ErrorHandlingStream extends Transform {
  _transform(chunk, encoding, callback) {
    try {
      // 可能出错的处理逻辑
      const processed = this.processData(chunk);
      callback(null, processed);
    } catch (error) {
      // 错误恢复或记录
      console.error('处理错误:', error.message);
      callback(null, chunk); // 传递原始数据
    }
  }

  processData(chunk) {
    // 模拟处理逻辑
    if (chunk.length > 1000) {
      throw new Error('数据块过大');
    }
    return chunk.toString().toUpperCase();
  }
}
```

### 性能优化

```javascript
const { Transform, Readable } = require('stream');
const { createPool } = require('generic-pool');

// 1. 高效缓冲区管理
class EfficientBufferStream extends Transform {
  constructor(options) {
    super({
      ...options,
      highWaterMark: 1024 * 1024 // 1MB 缓冲区
    });
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    // 高效的缓冲区操作
    this.buffer = Buffer.concat([this.buffer, chunk]);
    
    // 当缓冲区足够大时处理
    if (this.buffer.length >= 8192) {
      const processable = this.buffer.subarray(0, 8192);
      this.buffer = this.buffer.subarray(8192);
      callback(null, processable);
    } else {
      callback();
    }
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      callback(null, this.buffer);
    } else {
      callback();
    }
  }
}

// 2. 并行处理流
class ParallelProcessor extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.concurrency = options.concurrency || 5;
    this.pending = 0;
    this.queue = [];
  }

  _transform(item, encoding, callback) {
    if (this.pending < this.concurrency) {
      this.processItem(item, callback);
    } else {
      this.queue.push({ item, callback });
    }
  }

  async processItem(item, callback) {
    this.pending++;
    
    try {
      const result = await this.process(item);
      this.pending--;
      callback(null, result);
      this.processQueue();
    } catch (error) {
      this.pending--;
      callback(error);
      this.processQueue();
    }
  }

  processQueue() {
    while (this.pending < this.concurrency && this.queue.length > 0) {
      const { item, callback } = this.queue.shift();
      this.processItem(item, callback);
    }
  }

  async process(item) {
    // 模拟异步处理
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    return { ...item, processed: true };
  }
}
```

## 总结

Stream 的核心要点：

1. **四种类型**：Readable、Writable、Duplex、Transform
2. **核心优势**：
   - 内存效率：不需要将整个数据集加载到内存
   - 时间效率：边处理边传输
   - 可组合性：可以连接多个流形成管道
   - 背压处理：自动处理生产者和消费者速度不匹配

3. **应用场景**：
   - 大文件处理
   - HTTP 请求/响应处理
   - 实时数据处理
   - 数据库流式操作
   - 网络通信

4. **最佳实践**：
   - 使用 `pipeline` 进行错误处理
   - 合理设置 `highWaterMark`
   - 正确处理背压
   - 优雅关闭流资源

通过合理使用 Stream，可以构建高性能、内存效率高的 Node.js 应用程序。