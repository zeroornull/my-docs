---
title: 实现jwt鉴权机制
---

JWT (JSON Web Token) 鉴权机制是现代Web应用中广泛使用的身份验证和授权方案。让我详细讲解JWT鉴权的实现思路和最佳实践。

## 1. JWT 基础概念

### JWT 结构
```javascript
// JWT 由三部分组成，用点分隔
// header.payload.signature

// Header 示例
const header = {
  "alg": "HS256",  // 签名算法
  "typ": "JWT"     // Token 类型
};

// Payload 示例
const payload = {
  "sub": "1234567890",     // Subject (用户ID)
  "name": "John Doe",      // 用户名
  "iat": 1516239022,       // Issued at (签发时间)
  "exp": 1516242622,       // Expiration time (过期时间)
  "role": "user"           // 用户角色
};

// Signature 示例
// HMACSHA256(
//   base64UrlEncode(header) + "." +
//   base64UrlEncode(payload),
//   secret
// )
```

## 2. 后端实现

### JWT 工具类
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTManager {
  constructor(options = {}) {
    this.secret = options.secret || process.env.JWT_SECRET || 'default-secret';
    this.expiresIn = options.expiresIn || '24h';
    this.refreshSecret = options.refreshSecret || process.env.JWT_REFRESH_SECRET || 'refresh-secret';
    this.refreshExpiresIn = options.refreshExpiresIn || '7d';
  }

  // 生成访问令牌
  generateAccessToken(payload) {
    const tokenPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.getSeconds(this.expiresIn)
    };

    return jwt.sign(tokenPayload, this.secret, { 
      expiresIn: this.expiresIn,
      issuer: 'my-app',
      audience: 'my-app-users'
    });
  }

  // 生成刷新令牌
  generateRefreshToken(payload) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenPayload = {
      ...payload,
      refreshToken: refreshToken,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.getSeconds(this.refreshExpiresIn)
    };

    const token = jwt.sign(tokenPayload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn
    });

    return {
      token: token,
      refreshToken: refreshToken
    };
  }

  // 验证访问令牌
  verifyAccessToken(token) {
    try {
      return {
        valid: true,
        payload: jwt.verify(token, this.secret)
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // 验证刷新令牌
  verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, this.refreshSecret);
      return {
        valid: true,
        payload: payload
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // 刷新访问令牌
  refreshAccessToken(refreshToken) {
    const verification = this.verifyRefreshToken(refreshToken);
    
    if (!verification.valid) {
      throw new Error('Invalid refresh token');
    }

    const { payload } = verification;
    delete payload.iat;
    delete payload.exp;
    delete payload.refreshToken;

    return this.generateAccessToken(payload);
  }

  // 将时间字符串转换为秒数
  getSeconds(timeString) {
    const timeValue = parseInt(timeString);
    const timeUnit = timeString.replace(timeValue.toString(), '').toLowerCase();

    switch (timeUnit) {
      case 's': return timeValue;
      case 'm': return timeValue * 60;
      case 'h': return timeValue * 3600;
      case 'd': return timeValue * 86400;
      case 'w': return timeValue * 604800;
      default: return timeValue;
    }
  }
}

// 创建 JWT 管理器实例
const jwtManager = new JWTManager({
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: '7d'
});
```

### 用户认证服务
```javascript
const bcrypt = require('bcrypt');
const User = require('./models/User');

class AuthService {
  constructor(jwtManager) {
    this.jwtManager = jwtManager;
    this.refreshTokens = new Map(); // 在生产环境中应该使用 Redis 或数据库
  }

  // 用户登录
  async login(email, password) {
    try {
      // 查找用户
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }

      // 生成令牌
      const accessToken = this.jwtManager.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshTokens = this.jwtManager.generateRefreshToken({
        userId: user.id,
        email: user.email
      });

      // 存储刷新令牌（生产环境应存储到数据库或 Redis）
      this.refreshTokens.set(refreshTokens.refreshToken, {
        userId: user.id,
        email: user.email,
        createdAt: new Date()
      });

      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshTokens.token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  }

  // 用户注册
  async register(userData) {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({ 
        where: { email: userData.email } 
      });
      
      if (existingUser) {
        throw new Error('用户已存在');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // 创建用户
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      // 生成令牌
      const accessToken = this.jwtManager.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshTokens = this.jwtManager.generateRefreshToken({
        userId: user.id,
        email: user.email
      });

      // 存储刷新令牌
      this.refreshTokens.set(refreshTokens.refreshToken, {
        userId: user.id,
        email: user.email,
        createdAt: new Date()
      });

      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshTokens.token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('注册错误:', error);
      throw error;
    }
  }

  // 刷新令牌
  async refreshToken(oldRefreshToken) {
    try {
      // 验证刷新令牌
      const verification = this.jwtManager.verifyRefreshToken(oldRefreshToken);
      
      if (!verification.valid) {
        throw new Error('无效的刷新令牌');
      }

      const { payload } = verification;
      
      // 检查刷新令牌是否存在
      if (!this.refreshTokens.has(payload.refreshToken)) {
        throw new Error('刷新令牌已失效');
      }

      // 生成新的访问令牌
      const newAccessToken = this.jwtManager.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      });

      // 生成新的刷新令牌
      const newRefreshTokens = this.jwtManager.generateRefreshToken({
        userId: payload.userId,
        email: payload.email
      });

      // 删除旧的刷新令牌
      this.refreshTokens.delete(payload.refreshToken);
      
      // 存储新的刷新令牌
      this.refreshTokens.set(newRefreshTokens.refreshToken, {
        userId: payload.userId,
        email: payload.email,
        createdAt: new Date()
      });

      return {
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshTokens.token
      };
    } catch (error) {
      console.error('刷新令牌错误:', error);
      throw error;
    }
  }

  // 用户登出
  async logout(refreshToken) {
    try {
      // 验证刷新令牌
      const verification = this.jwtManager.verifyRefreshToken(refreshToken);
      
      if (verification.valid) {
        // 从存储中删除刷新令牌
        this.refreshTokens.delete(verification.payload.refreshToken);
      }

      return { success: true };
    } catch (error) {
      console.error('登出错误:', error);
      return { success: false, error: error.message };
    }
  }
}

const authService = new AuthService(jwtManager);
```

## 3. Express.js 中间件实现

### 认证中间件
```javascript
const express = require('express');
const app = express();

// JWT 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  const verification = jwtManager.verifyAccessToken(token);
  
  if (!verification.valid) {
    return res.status(403).json({ 
      error: '无效的访问令牌',
      details: verification.error 
    });
  }

  req.user = verification.payload;
  next();
};

// 角色授权中间件
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' });
    }

    next();
  };
};

// 可选认证中间件（用于可选登录的接口）
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const verification = jwtManager.verifyAccessToken(token);
    if (verification.valid) {
      req.user = verification.payload;
    }
  }

  next();
};

// 应用中间件
app.use(express.json());

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// 注册接口
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 刷新令牌接口
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// 登出接口
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const result = await authService.logout(req.body.refreshToken);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 受保护的路由示例
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    message: '这是受保护的用户资料接口'
  });
});

// 管理员专用路由
app.get('/api/admin/users', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({
    message: '只有管理员可以访问此接口'
  });
});

// 可选认证的接口
app.get('/api/public-content', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      content: '公共内容（已登录用户）',
      user: req.user.name
    });
  } else {
    res.json({
      content: '公共内容（未登录用户）'
    });
  }
});
```

## 4. 前端实现

### JWT 客户端管理
```javascript
class JWTClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '/api';
    this.storageKey = options.storageKey || 'auth_tokens';
    this.refreshThreshold = options.refreshThreshold || 300; // 5分钟
  }

  // 获取存储的令牌
  getTokens() {
    try {
      const tokens = localStorage.getItem(this.storageKey);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('获取令牌失败:', error);
      return null;
    }
  }

  // 存储令牌
  setTokens(tokens) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tokens));
    } catch (error) {
      console.error('存储令牌失败:', error);
    }
  }

  // 清除令牌
  clearTokens() {
    localStorage.removeItem(this.storageKey);
  }

  // 检查令牌是否即将过期
  isTokenExpiringSoon(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp - now < this.refreshThreshold;
    } catch (error) {
      return true;
    }
  }

  // 刷新令牌
  async refreshToken() {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      throw new Error('无刷新令牌');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('刷新令牌失败');
      }

      const newTokens = await response.json();
      this.setTokens(newTokens);
      return newTokens;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // 自动刷新令牌
  async autoRefreshToken() {
    const tokens = this.getTokens();
    if (tokens?.accessToken && this.isTokenExpiringSoon(tokens.accessToken)) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('自动刷新令牌失败:', error);
        this.clearTokens();
        // 可以在这里触发登出事件
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  }

  // 带自动刷新的请求
  async authenticatedFetch(url, options = {}) {
    // 检查并刷新令牌
    await this.autoRefreshToken();

    const tokens = this.getTokens();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    // 处理 401 错误
    if (response.status === 401) {
      this.clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    return response;
  }

  // 登录
  async login(credentials) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('登录失败');
    }

    const tokens = await response.json();
    this.setTokens(tokens);
    return tokens;
  }

  // 注册
  async register(userData) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('注册失败');
    }

    const tokens = await response.json();
    this.setTokens(tokens);
    return tokens;
  }

  // 登出
  async logout() {
    const tokens = this.getTokens();
    
    if (tokens?.refreshToken) {
      try {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.accessToken}`
          },
          body: JSON.stringify({
            refreshToken: tokens.refreshToken
          })
        });
      } catch (error) {
        console.error('登出请求失败:', error);
      }
    }

    this.clearTokens();
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  // 检查是否已认证
  isAuthenticated() {
    const tokens = this.getTokens();
    if (!tokens?.accessToken) return false;

    try {
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }
}

// 创建客户端实例
const jwtClient = new JWTClient({
  baseUrl: '/api',
  refreshThreshold: 300 // 5分钟
});
```

### React 雴权组件
```jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      if (jwtClient.isAuthenticated()) {
        try {
          // 获取用户信息
          const response = await jwtClient.authenticatedFetch('/api/profile');
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          }
        } catch (error) {
          console.error('初始化认证失败:', error);
          jwtClient.clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();

    // 监听登出事件
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // 登录函数
  const login = async (credentials) => {
    try {
      const tokens = await jwtClient.login(credentials);
      setUser(tokens.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 注册函数
  const register = async (userData) => {
    try {
      const tokens = await jwtClient.register(userData);
      setUser(tokens.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 登出函数
  const logout = async () => {
    await jwtClient.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证的 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 受保护路由组件
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <div>权限不足</div>;
  }

  return children;
};

// 登录组件示例
const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(credentials);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('登录失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="邮箱"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="密码"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">登录</button>
    </form>
  );
};
```

## 5. 安全最佳实践

### 令牌安全存储
```javascript
// 使用 HttpOnly Cookie 存储刷新令牌（更安全）
const cookie = require('cookie');

// 设置安全的 Cookie
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    
    // 设置 HttpOnly Cookie 存储刷新令牌
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
    });

    // 只返回访问令牌给前端
    res.json({
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// 使用 Cookie 获取刷新令牌
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: '刷新令牌缺失' });
  }

  try {
    const result = authService.refreshToken(refreshToken);
    
    res.json({
      accessToken: result.accessToken
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
```

### 令牌黑名单机制
```javascript
// 使用 Redis 实现令牌黑名单
const redis = require('redis');
const redisClient = redis.createClient();

class TokenBlacklist {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  // 将令牌加入黑名单
  async blacklistToken(token, expiresIn) {
    try {
      const payload = jwt.decode(token);
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      
      if (ttl > 0) {
        await this.redis.setex(`blacklist:${token}`, ttl, '1');
      }
    } catch (error) {
      console.error('加入黑名单失败:', error);
    }
  }

  // 检查令牌是否在黑名单中
  async isTokenBlacklisted(token) {
    try {
      const result = await this.redis.get(`blacklist:${token}`);
      return !!result;
    } catch (error) {
      console.error('检查黑名单失败:', error);
      return false;
    }
  }
}

const tokenBlacklist = new TokenBlacklist(redisClient);

// 改进的认证中间件
const authenticateTokenWithBlacklist = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  // 检查令牌是否在黑名单中
  const isBlacklisted = await tokenBlacklist.isTokenBlacklisted(token);
  if (isBlacklisted) {
    return res.status(401).json({ error: '令牌已失效' });
  }

  const verification = jwtManager.verifyAccessToken(token);
  
  if (!verification.valid) {
    return res.status(403).json({ 
      error: '无效的访问令牌',
      details: verification.error 
    });
  }

  req.user = verification.payload;
  next();
};
```

## 总结

JWT 鉴权机制的核心要点：

1. **令牌结构**：理解 JWT 的三部分结构（Header、Payload、Signature）
2. **双令牌机制**：使用访问令牌和刷新令牌提高安全性
3. **安全存储**：合理存储令牌，避免 XSS 和 CSRF 攻击
4. **中间件实现**：创建可复用的认证和授权中间件
5. **前端集成**：实现自动刷新和错误处理
6. **安全最佳实践**：使用 HTTPS、设置合适的过期时间、实现令牌黑名单等

通过这样的实现，可以构建一个安全、可靠、用户体验良好的 JWT 鉴权系统。