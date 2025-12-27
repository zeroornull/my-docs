---
title: websocket实现
---

##### 概述
WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，它使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。


##### WebSocket 基本概念
**特点：**
* 全双工通信：客户端和服务器可以同时发送和接收数据
* 低延迟：相比 HTTP 轮询，WebSocket 建立连接后通信效率更高
* 持久连接：一旦建立连接，会保持连接状态
* 跨域支持：通过协议升级实现，不受同源策略限制

**协议流程:**
* 客户端发起 WebSocket 握手请求（HTTP Upgrade）
* 服务器响应协议升级
* 建立连接后，双方可以自由通信


##### 客户端实现
```javascript
const socket = new WebSocket('ws://example.com/socket');

// 连接打开时
socket.onopen = function(event) {
  console.log('连接已建立');
  socket.send('Hello Server!');
};

// 接收消息
socket.onmessage = function(event) {
  console.log('收到消息: ' + event.data);
};

// 连接关闭时
socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`连接正常关闭，code=${event.code} reason=${event.reason}`);
  } else {
    console.log('连接中断');
  }
};

// 发生错误时
socket.onerror = function(error) {
  console.log('发生错误: ' + error.message);
};
```

##### 服务端实现
```javascript
const WebSocket = require('ws');
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server');
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// 监听连接
wss.on('connection', (ws) => {
    console.log('新的客户端连接');
    
    // 发送欢迎消息
    ws.send('欢迎连接到 WebSocket 服务器!');
    
    // 接收消息
    ws.on('message', (message) => {
        console.log('收到消息: %s', message);
        
        // 广播消息给所有客户端
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`客户端说: ${message}`);
            }
        });
    });
    
    // 连接关闭
    ws.on('close', () => {
        console.log('客户端断开连接');
    });
});

// 启动服务器
server.listen(8080, () => {
    console.log('服务器运行在 http://localhost:8080');
});
```

##### 心跳检测
```javascript
// 服务器端
function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
});

// 每隔30秒检查一次
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);
```

##### 消息序列化
```javascript
// 通常使用 JSON 格式：

// 客户端发送
socket.send(JSON.stringify({ type: 'chat', content: 'Hello' }));

// 服务器接收
ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log(data.type, data.content);
});
```

##### 错误处理与重连
```javascript
// 客户端
function connect() {
    const socket = new WebSocket('ws://localhost:8080');
    
    socket.onclose = function(e) {
        console.log('连接关闭，5秒后尝试重连...');
        setTimeout(connect, 5000);
    };
    
    socket.onerror = function(err) {
        console.error('发生错误:', err);
        socket.close();
    };
}

connect();
```


##### 实际应用场景
* 实时聊天应用
* 多人协作编辑工具
* 实时数据监控仪表盘
* 在线游戏
* 股票行情实时更新


##### 注意事项
* 安全性：使用 wss:// 代替 ws:// 进行加密通信
* 兼容性：现代浏览器都支持 WebSocket，但老旧浏览器可能需要降级方案
* 负载均衡：WebSocket 是持久连接，需要考虑服务器负载均衡策略
* 心跳机制：防止因网络问题导致的"僵尸连接"
