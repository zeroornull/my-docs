---
title: HTTP 报文结构是怎样的
---

HTTP（HyperText Transfer Protocol）报文是HTTP协议中客户端与服务器之间通信的数据单元。HTTP报文分为两种类型：请求报文和响应报文。

## HTTP 请求报文结构

HTTP请求报文由以下几部分组成：

1. **请求行（Request Line）**
2. **请求头（Request Headers）**
3. **空行（CRLF）**
4. **请求体（Request Body，可选）**

### 请求报文示例

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer token123
Content-Length: 45

{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

#### 结构分析：

- **请求行**：`POST /api/users HTTP/1.1`
  - `POST`：请求方法
  - `/api/users`：请求路径
  - `HTTP/1.1`：HTTP版本

- **请求头**：
  - `Host: example.com`：指定服务器的域名
  - `Content-Type: application/json`：指示请求体的媒体类型
  - `Authorization: Bearer token123`：认证信息
  - `Content-Length: 45`：请求体的长度

- **空行**：分隔请求头和请求体

- **请求体**：包含要发送给服务器的数据

## HTTP 响应报文结构

HTTP响应报文由以下几部分组成：

1. **状态行（Status Line）**
2. **响应头（Response Headers）**
3. **空行（CRLF）**
4. **响应体（Response Body）**

### 响应报文示例

```http
HTTP/1.1 201 Created
Content-Type: application/json
Date: Mon, 27 Jul 2023 12:00:00 GMT
Server: Apache/2.4.41
Content-Length: 68

{
  "id": 123,
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

#### 结构分析：

- **状态行**：`HTTP/1.1 201 Created`
  - `HTTP/1.1`：HTTP版本
  - `201`：状态码
  - `Created`：状态描述

- **响应头**：
  - `Content-Type: application/json`：响应体的媒体类型
  - `Date: Mon, 27 Jul 2023 12:00:00 GMT`：响应生成时间
  - `Server: Apache/2.4.41`：服务器信息
  - `Content-Length: 68`：响应体的长度

- **空行**：分隔响应头和响应体

- **响应体**：包含服务器返回的数据

## 关键组成部分详解

### 1. 请求方法（Request Methods）

常见的HTTP请求方法包括：
- `GET`：获取资源
- `POST`：创建资源
- `PUT`：更新资源
- `DELETE`：删除资源
- `PATCH`：部分更新资源

### 2. 状态码（Status Codes）

HTTP状态码分为五类：
- **1xx**：信息性状态码（如100 Continue）
- **2xx**：成功状态码（如200 OK, 201 Created）
- **3xx**：重定向状态码（如301 Moved Permanently, 302 Found）
- **4xx**：客户端错误状态码（如400 Bad Request, 404 Not Found）
- **5xx**：服务器错误状态码（如500 Internal Server Error, 503 Service Unavailable）

### 3. 常见头部字段

#### 通用头部字段
- `Cache-Control`：缓存控制
- `Connection`：连接管理
- `Date`：报文创建时间

#### 请求头部字段
- `Host`：目标服务器的主机名和端口号
- `User-Agent`：客户端信息
- `Accept`：客户端可处理的媒体类型
- `Authorization`：认证信息

#### 响应头部字段
- `Server`：服务器软件信息
- `Location`：重定向的目标URL
- `Set-Cookie`：设置Cookie

### 4. 报文主体

报文主体可以包含多种形式的数据：
- HTML文档
- JSON数据
- 图片文件
- XML数据
- 二进制数据

## 实际应用示例

### 简单GET请求示例

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

对应的响应：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <h1>欢迎访问示例网站</h1>
</body>
</html>
```

### POST请求提交表单数据

```http
POST /login HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=admin&password=123456
```

### 带有Cookie的请求

```http
GET /profile HTTP/1.1
Host: www.example.com
Cookie: sessionid=abc123; user_pref=zh-CN
```

HTTP报文结构的清晰性和标准化使得不同系统之间的通信变得可靠和一致，这是Web技术的基础之一。