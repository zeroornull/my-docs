---
title: Node 中的 Buffer
---

## Node.js 中的 Buffer 详解

### 1. Buffer 的基本概念

`Buffer` 是 Node.js 中用于处理二进制数据的一个全局对象，它类似于一个整数数组，但对应于 V8 外部的原始内存。

```javascript
// 创建 Buffer 的几种方式
const buf1 = Buffer.alloc(10); // 创建一个长度为10的零填充 Buffer
const buf2 = Buffer.alloc(10, 1); // 创建一个长度为10，用 1 填充的 Buffer
const buf3 = Buffer.allocUnsafe(10); // 创建一个长度为10的未初始化 Buffer
const buf4 = Buffer.from([1, 2, 3]); // 从数组创建 Buffer
const buf5 = Buffer.from('hello', 'utf8'); // 从字符串创建 Buffer
```

### 2. Buffer 的核心特性

- **内存管理**：Buffer 在 Node.js 的堆外内存中分配，不经过 V8 的垃圾回收机制
- **固定长度**：一旦创建，Buffer 的大小不能改变
- **字节操作**：可以直接操作字节级别的数据

```javascript
// Buffer 基本操作示例
const buf = Buffer.from('Hello World', 'utf8');

console.log(buf.length); // 11
console.log(buf.toString()); // "Hello World"
console.log(buf.toString('hex')); // "48656c6c6f20576f726c64"
console.log(buf.toJSON()); // { type: 'Buffer', data: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100] }

// 修改 Buffer 中的数据
buf[0] = 0x41; // 将第一个字节改为 0x41 (ASCII 'A')
console.log(buf.toString()); // "Aello World"
```

### 3. 主要应用场景

#### 3.1 文件操作

```javascript
const fs = require('fs');

// 读取二进制文件
fs.readFile('image.png', (err, data) => {
  if (err) throw err;
  console.log(Buffer.isBuffer(data)); // true
  console.log(`文件大小: ${data.length} 字节`);
});

// 写入二进制数据
const buffer = Buffer.from('Hello, Binary World!', 'utf8');
fs.writeFile('output.bin', buffer, (err) => {
  if (err) throw err;
  console.log('二进制文件写入成功');
});
```

#### 3.2 网络通信

```javascript
const net = require('net');

// TCP 服务器示例
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // 接收到的数据就是 Buffer 类型
    console.log('接收到的数据:', data.toString());
    
    // 发送 Buffer 数据
    const response = Buffer.from('HTTP/1.1 200 OK\r\n\r\nHello World', 'utf8');
    socket.write(response);
  });
});

server.listen(8080);
```

#### 3.3 加密和哈希

```javascript
const crypto = require('crypto');

// 创建哈希
const hash = crypto.createHash('sha256');
const data = Buffer.from('需要哈希的数据', 'utf8');

hash.update(data);
const digest = hash.digest('hex');
console.log('SHA256 哈希值:', digest);

// 加密操作
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipher(algorithm, key, iv);
let encrypted = cipher.update(Buffer.from('敏感数据', 'utf8'));
encrypted = Buffer.concat([encrypted, cipher.final()]);

console.log('加密后的数据:', encrypted.toString('hex'));
```

#### 3.4 图像处理

```javascript
// 模拟图像数据处理
function processImageData(imageBuffer) {
  // 假设这是一个 PNG 图像，检查文件头
  const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  const header = imageBuffer.slice(0, 8);
  
  const isPng = pngHeader.every((byte, index) => byte === header[index]);
  
  if (isPng) {
    console.log('这是一个有效的 PNG 文件');
    // 进一步处理 PNG 数据...
  } else {
    console.log('不是有效的 PNG 文件');
  }
}

// 使用示例
const fakePng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
processImageData(fakePng);
```

#### 3.5 流处理

```javascript
const { Transform } = require('stream');

// 创建一个转换流来处理 Buffer 数据
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // chunk 是一个 Buffer
    const upperCaseChunk = Buffer.from(chunk.toString().toUpperCase());
    this.push(upperCaseChunk);
    callback();
  }
}

const upperCaseStream = new UpperCaseTransform();

upperCaseStream.on('data', (data) => {
  console.log('转换后的数据:', data.toString());
});

upperCaseStream.write(Buffer.from('hello'));
upperCaseStream.write(Buffer.from('world'));
upperCaseStream.end();
```

### 4. Buffer 的性能考虑

```javascript
// 性能对比示例
console.time('alloc');
const buf1 = Buffer.alloc(1000000); // 安全但较慢
console.timeEnd('alloc');

console.time('allocUnsafe');
const buf2 = Buffer.allocUnsafe(1000000); // 快但可能包含敏感数据
console.timeEnd('allocUnsafe');

// 正确使用 allocUnsafe
const buf3 = Buffer.allocUnsafe(10);
buf3.fill(0); // 手动清零敏感数据
```

### 5. Buffer 与其他数据类型的转换

```javascript
// Buffer 与字符串
const str = '你好世界';
const bufFromStr = Buffer.from(str, 'utf8');
console.log(bufFromStr.toString('utf8')); // "你好世界"

// Buffer 与 Base64
const base64Str = bufFromStr.toString('base64');
console.log(Buffer.from(base64Str, 'base64').toString('utf8')); // "你好世界"

// Buffer 与数组
const arr = [0x48, 0x65, 0x6c, 0x6c, 0x6f];
const bufFromArray = Buffer.from(arr);
console.log(bufFromArray.toString()); // "Hello"
```

### 总结

`Buffer` 是 Node.js 处理二进制数据的核心工具，特别适用于：
- 文件 I/O 操作
- 网络编程
- 加密解密
- 图像/音视频处理
- 协议解析等场景

它提供了高效的二进制数据操作能力，是 Node.js 能够高效处理各种数据格式的重要基础。