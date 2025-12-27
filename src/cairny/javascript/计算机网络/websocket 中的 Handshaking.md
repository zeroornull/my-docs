---
title: websocket 中的 Handshaking
---

## WebSocket Handshaking 详解

WebSocket 的握手（Handshaking）是建立 WebSocket 连接的关键步骤，它通过 HTTP 协议完成从 HTTP 连接到 WebSocket 连接的升级过程。

### 握手过程概述

WebSocket 握手采用 HTTP 协议进行，客户端发送一个特殊的 HTTP 请求，服务器响应后双方建立 WebSocket 连接。

### 客户端握手请求

客户端发送的握手请求具有以下关键特征：

1. **HTTP 方法**：使用 `GET` 方法
2. **Upgrade 头**：包含 `Upgrade: websocket`
3. **Connection 头**：包含 `Connection: Upgrade`
4. **Sec-WebSocket-Key 头**：包含一个 Base64 编码的随机值
5. **Sec-WebSocket-Version 头**：指定 WebSocket 协议版本

示例客户端握手请求：
```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Version: 13
```

### 服务端握手响应

服务器验证客户端请求后，返回 101 状态码表示协议切换成功：

1. **状态码**：`101 Switching Protocols`
2. **Upgrade 头**：`Upgrade: websocket`
3. **Connection 头**：`Connection: Upgrade`
4. **Sec-WebSocket-Accept 头**：基于客户端 `Sec-WebSocket-Key` 计算得出

示例服务端握手响应：
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### Sec-WebSocket-Accept 计算过程

服务器根据客户端提供的 `Sec-WebSocket-Key` 计算 `Sec-WebSocket-Accept`：

1. 将客户端的 key 与 GUID `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接
2. 对拼接结果进行 SHA-1 哈希
3. 将哈希结果进行 Base64 编码

例如：
```
客户端 Key: dGhlIHNhbXBsZSBub25jZQ==
拼接字符串: dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-C5AB0DC85B11
SHA-1 哈希: b3df89b0bceeb3b5859014f0c8296a1a028c1381
Base64 编码: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### 完整握手示例

以下是一个完整的 WebSocket 握手过程示例：

**客户端请求：**
```http
GET /websocket HTTP/1.1
Host: localhost:8080
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: Z7OY1UwDFJ0jE5UJQdL8jQ==
Origin: http://localhost
```

**服务器响应：**
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: XbPp0hpcKmKW3bZQZ11Nw5TCy2Y=
```

握手成功后，连接就从 HTTP 协议升级为 WebSocket 协议，双方可以开始进行双向通信。

### 握手验证要点

服务器在握手过程中需要验证：
- `Connection` 头包含 "Upgrade"
- `Upgrade` 头值为 "websocket"
- `Sec-WebSocket-Version` 为支持的版本
- `Sec-WebSocket-Key` 存在且格式正确

握手完成后，原始的 HTTP 连接被升级为 WebSocket 连接，后续的数据传输都遵循 WebSocket 协议规范。