---
title: SSE协议
---

## SSE (Server-Sent Events) 协议详解

### 什么是 SSE？

SSE（Server-Sent Events）是一种允许服务器向客户端推送实时数据的协议。它基于 HTTP 协议，提供了服务器到客户端的单向数据流传输机制。

### SSE 的核心特点

1. **单向通信**：数据只能从服务器流向客户端
2. **基于 HTTP**：使用标准的 HTTP 协议，兼容性好
3. **自动重连**：连接断开后会自动尝试重新连接
4. **简单轻量**：相比 WebSocket 更加简单易用
5. **文本数据**：主要传输文本数据（UTF-8 编码）

### SSE 数据格式

SSE 使用简单的文本格式进行数据传输，每条消息由以下字段组成：

- `data:` - 数据内容（必需）
- `event:` - 事件类型（可选）
- `id:` - 事件 ID（可选）
- `retry:` - 重连时间（可选）

每条消息以空行结束。

### 代码示例

#### 1. 客户端实现（JavaScript）

```javascript
// 创建 EventSource 连接
const eventSource = new EventSource('/sse');

// 监听默认消息事件
eventSource.onmessage = function(event) {
    console.log('收到消息:', event.data);
};

// 监听自定义事件
eventSource.addEventListener('notification', function(event) {
    console.log('通知:', event.data);
});

// 监听连接打开事件
eventSource.onopen = function(event) {
    console.log('连接已建立');
};

// 监听错误事件
eventSource.onerror = function(event) {
    console.log('连接错误');
};

// 关闭连接
// eventSource.close();
```

#### 2. 服务端实现（Node.js）

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // 检查是否为 SSE 请求
    if (req.url === '/sse') {
        // 设置 SSE 相关的响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // 发送初始数据
        res.write('data: 连接建立成功\n\n');

        // 定时发送数据
        const interval = setInterval(() => {
            const data = {
                time: new Date().toISOString(),
                message: '服务器时间推送'
            };
            
            // 发送默认事件
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            
            // 发送自定义事件
            res.write(`event: notification\ndata: 新通知 ${new Date().toLocaleTimeString()}\n\n`);
        }, 5000);

        // 客户端断开连接时清理资源
        req.on('close', () => {
            clearInterval(interval);
        });
    } else {
        // 普通 HTTP 响应
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SSE 示例</title>
            </head>
            <body>
                <h1>Server-Sent Events 示例</h1>
                <div id="messages"></div>
                <script>
                    const eventSource = new EventSource('/sse');
                    const messages = document.getElementById('messages');
                    
                    eventSource.onmessage = function(event) {
                        const div = document.createElement('div');
                        div.textContent = '消息: ' + event.data;
                        messages.appendChild(div);
                    };
                    
                    eventSource.addEventListener('notification', function(event) {
                        const div = document.createElement('div');
                        div.textContent = '通知: ' + event.data;
                        messages.appendChild(div);
                    });
                </script>
            </body>
            </html>
        `);
    }
});

server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});
```

#### 3. 复杂数据示例

```javascript
// 客户端处理复杂数据
const eventSource = new EventSource('/api/events');

eventSource.addEventListener('user-update', function(event) {
    const userData = JSON.parse(event.data);
    console.log('用户更新:', userData);
    
    // 更新 UI
    document.getElementById('username').textContent = userData.name;
    document.getElementById('status').textContent = userData.status;
});

eventSource.addEventListener('stock-price', function(event) {
    const stockData = JSON.parse(event.data);
    console.log('股价更新:', stockData);
    
    // 更新股价显示
    document.getElementById('price').textContent = stockData.price;
    document.getElementById('change').textContent = stockData.change;
});
```

```javascript
// 服务端发送复杂数据
app.get('/api/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // 发送用户信息更新
    const sendUserUpdate = () => {
        const userData = {
            id: 123,
            name: '张三',
            status: '在线',
            lastActive: new Date().toISOString()
        };
        
        res.write(`event: user-update\ndata: ${JSON.stringify(userData)}\n\n`);
    };

    // 发送股价信息
    const sendStockPrice = () => {
        const stockData = {
            symbol: 'AAPL',
            price: (Math.random() * 100 + 150).toFixed(2),
            change: (Math.random() - 0.5).toFixed(2)
        };
        
        res.write(`event: stock-price\ndata: ${JSON.stringify(stockData)}\n\n`);
    };

    // 定时发送不同类型的数据
    setInterval(sendUserUpdate, 10000);
    setInterval(sendStockPrice, 5000);
});
```

### SSE 与 WebSocket 对比

| 特性 | SSE | WebSocket |
|------|-----|-----------|
| 连接方向 | 单向（服务器→客户端） | 双向 |
| 协议 | HTTP | WebSocket |
| 数据格式 | 文本 | 文本/二进制 |
| 实现复杂度 | 简单 | 复杂 |
| 浏览器支持 | 现代浏览器支持良好 | 现代浏览器支持良好 |
| 适用场景 | 实时通知、数据推送 | 实时聊天、游戏等 |

### SSE 的优势

1. **简单易用**：基于 HTTP，无需额外协议
2. **自动重连**：内置重连机制
3. **低开销**：相比 WebSocket 更轻量
4. **良好的错误处理**：标准化的错误处理机制
5. **HTTP 兼容性**：可以穿越大多数代理和防火墙

### 注意事项

1. **IE 兼容性**：IE 不支持 EventSource，需要 polyfill
2. **最大连接数**：浏览器对同一域名的 SSE 连接数有限制
3. **数据大小**：不适合传输大量数据
4. **安全性**：需要考虑跨域和认证问题

SSE 是一种非常适合服务器向客户端推送实时数据的解决方案，特别适用于实时通知、股票价格更新、系统监控等场景。