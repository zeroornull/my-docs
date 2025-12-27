---
title: 跨域时怎么处理 cookie
---

## 跨域时处理 Cookie 的机制和方法

### 跨域 Cookie 的基本概念

跨域 Cookie 处理涉及浏览器的同源策略和 CORS（跨源资源共享）机制。由于安全限制，跨域请求默认不会携带 Cookie，需要特殊配置才能实现。

### 处理跨域 Cookie 的关键配置

#### 1. 客户端配置（以 JavaScript 为例）

```javascript
// 使用 fetch 发送跨域请求时携带凭证
fetch('https://api.example.com/data', {
  method: 'GET',
  credentials: 'include' // 关键配置：允许携带 Cookie
})
.then(response => response.json())
.then(data => console.log(data));

// 使用 XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.withCredentials = true; // 允许携带凭证
xhr.open('GET', 'https://api.example.com/data');
xhr.send();
```

#### 2. 服务端配置（以 Node.js/Express 为例）

```javascript
// 设置 CORS 头部允许携带凭证
app.use((req, res, next) => {
  // 允许特定源访问（不能使用 *）
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  // 允许携带凭证信息
  res.header('Access-Control-Allow-Credentials', 'true');
  // 允许的请求头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 设置 Cookie 时指定域名和安全属性
res.cookie('sessionId', 'abc123', {
  domain: '.example.com',    // 指定域名
  path: '/',                 // 指定路径
  httpOnly: true,            // 防止 XSS 攻击
  secure: true,              // 仅在 HTTPS 下传输
  sameSite: 'none'           // 允许跨站请求携带
});
```

### 完整示例：用户登录认证场景

#### 前端实现

```javascript
// 登录请求
async function login(username, password) {
  try {
    const response = await fetch('https://api.backend.com/auth/login', {
      method: 'POST',
      credentials: 'include', // 关键：允许携带和设置 Cookie
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      console.log('登录成功');
      // 登录成功后可以进行其他需要认证的请求
      await fetchUserData();
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
}

// 获取用户数据（需要认证）
async function fetchUserData() {
  try {
    const response = await fetch('https://api.backend.com/user/profile', {
      method: 'GET',
      credentials: 'include' // 携带认证 Cookie
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('用户数据:', userData);
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
}
```

#### 后端实现（Node.js + Express）

```javascript
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

// CORS 配置
app.use(cors({
  origin: 'https://frontend.example.com', // 前端域名
  credentials: true // 允许携带凭证
}));

app.use(express.json());

// Session 配置
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // 仅在 HTTPS 下使用
    httpOnly: true,      // 防止 XSS
    sameSite: 'none',    // 允许跨站请求
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 登录接口
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户凭据（示例）
  if (username === 'admin' && password === 'password') {
    req.session.userId = 123;
    req.session.username = username;
    
    // 设置 Cookie
    res.cookie('authToken', 'token123', {
      domain: '.example.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, message: '登录成功' });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 用户信息接口
app.get('/user/profile', (req, res) => {
  // 检查用户是否已认证
  if (req.session.userId) {
    res.json({
      userId: req.session.userId,
      username: req.session.username
    });
  } else {
    res.status(401).json({ error: '未认证' });
  }
});

app.listen(3000, () => {
  console.log('服务器运行在端口 3000');
});
```

### 重要注意事项

1. **Access-Control-Allow-Origin 不能为 `*`**
   - 当 `credentials` 设置为 `true` 时，`Access-Control-Allow-Origin` 必须指定具体域名

2. **Cookie 属性设置**
   - `SameSite`: 设置为 `none` 才允许跨站请求携带
   - `Secure`: 在 HTTPS 环境下必须设置为 `true`
   - `Domain`: 需要正确设置域名，支持子域名访问

3. **浏览器安全策略**
   - Chrome 80+ 对 SameSite 属性有更严格的要求
   - 必须在安全上下文（HTTPS）中使用

4. **调试技巧**
   - 使用浏览器开发者工具检查 Network 面板中的请求头和响应头
   - 查看 Application 面板中的 Cookie 信息
   - 确认服务器返回的 CORS 头部是否正确

通过以上配置和示例，可以正确处理跨域场景下的 Cookie 认证，实现安全的跨域通信。