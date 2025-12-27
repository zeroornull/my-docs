---
title: HTTP1.0，HTTP1.1，HTTP2.0区别
---

我将详细讲解HTTP 1.0、HTTP 1.1和HTTP 2.0的主要区别和特点。

## HTTP 1.0

HTTP 1.0是HTTP协议的第一个广泛使用的版本，于1996年发布。

### 主要特点：
- **无状态**：每个请求/响应对都是独立的，服务器不保留之前请求的信息
- **无连接**：每次请求都需要建立新的TCP连接，请求完成后立即断开
- **简单请求方法**：支持GET、POST、HEAD等基本方法
- **无主机头**：不支持虚拟主机，因为假定每个IP地址只有一个网站

### 示例：
```http
GET /index.html HTTP/1.0
User-Agent: Mozilla/5.0
```

## HTTP 1.1

HTTP 1.1于1997年发布，是对HTTP 1.0的重大改进。

### 主要改进：
- **持久连接**：默认使用持久连接（Keep-Alive），同一连接可以发送多个请求
- **管道化**：允许客户端在收到前一个响应之前发送下一个请求
- **主机头支持**：引入`Host`头部，支持虚拟主机
- **缓存控制**：增强缓存机制，支持`Cache-Control`、`ETag`等
- **分块传输编码**：支持动态内容的流式传输
- **字节范围请求**：支持断点续传

### 示例：
```http
GET /index.html HTTP/1.1
Host: www.example.com
Connection: keep-alive
User-Agent: Mozilla/5.0
```

## HTTP 2.0

HTTP/2于2015年发布，基于Google的SPDY协议，是HTTP协议的一次重大升级。

### 核心特性：
- **二进制协议**：使用二进制格式而非文本格式
- **多路复用**：在单个连接上并行发送多个请求和响应
- **头部压缩**：使用HPACK算法压缩HTTP头部
- **服务器推送**：服务器可以主动向客户端推送资源
- **流优先级**：可以为不同的请求设置优先级

### 示例：
HTTP/2使用二进制帧，无法直接以文本形式展示，但逻辑上等价于：
```http
:method: GET
:scheme: https
:path: /index.html
:authority: www.example.com
user-agent: Mozilla/5.0
```

## 对比总结

| 特性 | HTTP 1.0 | HTTP 1.1 | HTTP 2.0 |
|------|----------|----------|----------|
| 连接管理 | 每请求新建连接 | 持久连接 | 单连接多路复用 |
| 数据格式 | 文本 | 文本 | 二进制 |
| 并发性 | 无 | 管道化(有限) | 多路复用 |
| 头部压缩 | 无 | 无 | HPACK压缩 |
| 服务器推送 | 不支持 | 不支持 | 支持 |

## 实际应用场景

### HTTP 1.0场景示例：
一个网页包含3个资源（HTML、CSS、JS），需要建立3个TCP连接：
```
连接1: GET /index.html -> 响应HTML
关闭连接1
连接2: GET /style.css -> 响应CSS
关闭连接2
连接3: GET /script.js -> 响应JS
关闭连接3
```

### HTTP 1.1场景示例：
同样3个资源，只需要1个TCP连接：
```
连接: GET /index.html -> 响应HTML
      GET /style.css -> 响应CSS
      GET /script.js -> 响应JS
关闭连接
```

### HTTP 2.0场景示例：
3个资源在1个连接上并行传输：
```
连接: STREAM 1: GET /index.html
      STREAM 2: GET /style.css
      STREAM 3: GET /script.js
      <- 响应HTML帧
      <- 响应CSS帧
      <- 响应JS帧
```

HTTP协议的演进主要是为了解决性能问题，从HTTP 1.0的低效连接管理，到HTTP 1.1的持久连接，再到HTTP 2.0的多路复用和二进制优化，每次升级都显著提升了Web性能。
