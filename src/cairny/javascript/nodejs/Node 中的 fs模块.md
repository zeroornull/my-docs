---
title: Node 中的 fs模块
---

## Node.js 中的 fs模块详解

fs(File System) 模块是 Node.js 中用于文件系统操作的核心模块，它提供了丰富的 API 来处理文件和目录的读取、写入、删除、重命名等操作。

### fs模块的主要特点

1.  **同步与异步操作**：大多数 fs方法都有同步和异步两种形式
2.  **Promise 支持**：Node.js v14+ 提供了 `fs/promises` API
3.  **流式操作**：支持大文件的高效处理

### 常用方法分类

#### 1. 文件读取

```javascript
const fs = require('fs');
const fsPromises = require('fs/promises');

// 异步读取文件
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 同步读取文件
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

// 使用 Promise 读取文件
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

#### 2. 文件写入

```javascript
// 异步写入文件（覆盖）
fs.writeFile('output.txt', 'Hello World', 'utf8', (err) => {
  if (err) throw err;
  console.log('File written successfully');
});

// 同步写入文件
try {
  fs.writeFileSync('output.txt', 'Hello World', 'utf8');
  console.log('File written successfully');
} catch (err) {
  console.error(err);
}

// 追加内容到文件
fs.appendFile('output.txt', '\nAppended text', 'utf8', (err) => {
  if (err) throw err;
  console.log('Content appended');
});
```

#### 3. 文件信息获取

```javascript
// 获取文件状态信息
fs.stat('example.txt', (err, stats) => {
  if (err) throw err;
  console.log(`Is file: ${stats.isFile()}`);
  console.log(`Is directory: ${stats.isDirectory()}`);
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Created at: ${stats.birthtime}`);
});

// 检查文件是否存在（Node.js v14.14.0+ 推荐使用 fs.access）
fs.access('example.txt', fs.constants.F_OK, (err) => {
  console.log(`${err ? 'File does not exist' : 'File exists'}`);
});
```

#### 4. 文件和目录操作

```javascript
// 创建目录
fs.mkdir('new-directory', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Directory created');
});

// 读取目录内容
fs.readdir('some-directory', (err, files) => {
  if (err) throw err;
  console.log('Files in directory:', files);
});

// 重命名文件或目录
fs.rename('old-name.txt', 'new-name.txt', (err) => {
  if (err) throw err;
  console.log('File renamed');
});

// 删除文件
fs.unlink('file-to-delete.txt', (err) => {
  if (err) throw err;
  console.log('File deleted');
});

// 删除空目录
fs.rmdir('empty-directory', (err) => {
  if (err) throw err;
  console.log('Directory deleted');
});
```

#### 5. 流式操作（适用于大文件）

```javascript
const fs = require('fs');

// 创建可读流
const readableStream = fs.createReadStream('large-file.txt');
readableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data`);
});
readableStream.on('end', () => {
  console.log('Finished reading file');
});

// 创建可写流
const writableStream = fs.createWriteStream('output.txt');
writableStream.write('Hello ');
writableStream.write('World!');
writableStream.end();
writableStream.on('finish', () => {
  console.log('File written with stream');
});

// 管道操作（复制文件）
const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');
readStream.pipe(writeStream);
```

### 实际应用示例

```javascript
const fs = require('fs').promises;

// 示例：处理配置文件
async function handleConfig() {
  try {
    // 检查配置文件是否存在
    await fs.access('config.json');
    
    // 读取配置
    const configData = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(configData);
    
    // 修改配置
    config.lastUpdated = new Date().toISOString();
    
    // 写回配置文件
    await fs.writeFile('config.json', JSON.stringify(config, null, 2));
    
    console.log('Configuration updated successfully');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 配置文件不存在，创建默认配置
      const defaultConfig = {
        port: 3000,
        host: 'localhost',
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeFile('config.json', JSON.stringify(defaultConfig, null, 2));
      console.log('Default configuration created');
    } else {
      console.error('Error handling config:', error);
    }
  }
}

handleConfig();
```

### 总结

fs模块是 Node.js 中处理文件系统操作的重要工具，提供了同步、异步和基于 Promise 的多种 API。在实际开发中，应根据具体场景选择合适的方法，对于大文件操作推荐使用流式处理以提高性能和内存效率。