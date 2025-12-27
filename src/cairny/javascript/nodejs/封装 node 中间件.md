---
title: 封装 node 中间件
---

中间件（Middleware）是 Node.js 和 Express.js 应用中的核心概念，让我详细解释中间件的概念和封装方法。

## 1. 中间件概念理解

### 什么是中间件？

中间件是在请求和响应循环中执行的函数，它可以：
- 执行代码
- 修改请求和响应对象
- 结束请求-响应循环
- 调用下一个中间件函数

```javascript
// 中间件的基本结构
function middlewareFunction(req, res, next) {
  // 1. 执行一些代码
  console.log('中间件执行');
  
  // 2. 修改请求/响应对象
  req.customProperty = 'some value';
  
  // 3. 结束请求或调用下一个中间件
  // res.send('结束请求');
  next(); // 调用下一个中间件
}
```

### 中间件的执行流程

```javascript
const express = require('express');
const app = express();

// 中间件执行顺序示例
console.log('1. 应用启动');

// 第一个中间件
app.use((req, res, next) => {
  console.log('2. 第一个中间件开始');
  next();
  console.log('6. 第一个中间件结束');
});

// 第二个中间件
app.use((req, res, next) => {
  console.log('3. 第二个中间件开始');
  next();
  console.log('5. 第二个中间件结束');
});

// 路由处理器
app.get('/', (req, res, next) => {
  console.log('4. 路由处理器');
  res.send('Hello World');
  next(); // 注意：即使发送了响应，也可以调用 next()
});

console.log('7. 服务器监听');
```

## 2. 中间件类型

### 应用级中间件
```javascript
const express = require('express');
const app = express();

// 1. 不指定路径的中间件（对所有请求生效）
app.use((req, res, next) => {
  console.log('所有请求都会经过这里');
  next();
});

// 2. 指定路径的中间件
app.use('/api', (req, res, next) => {
  console.log('只有 /api 开头的请求会经过这里');
  next();
});

// 3. 指定 HTTP 方法和路径的中间件
app.get('/user/:id', (req, res, next) => {
  console.log('GET /user/:id 请求');
  next();
});
```

### 路由级中间件
```javascript
const express = require('express');
const app = express();
const router = express.Router();

// 路由级中间件
router.use((req, res, next) => {
  console.log('路由级中间件');
  next();
});

router.get('/profile', (req, res) => {
  res.send('用户资料');
});

app.use('/user', router);
```

### 错误处理中间件
```javascript
// 错误处理中间件（必须有4个参数）
app.use((err, req, res, next) => {
  console.error('发生错误:', err);
  
  // 根据错误类型返回不同的响应
  if (err.type === 'validation') {
    res.status(400).json({ error: '验证失败', details: err.details });
  } else {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 抛出错误的示例
app.get('/error', (req, res, next) => {
  const error = new Error('模拟错误');
  error.type = 'validation';
  error.details = { field: 'email', message: '邮箱格式不正确' };
  next(error); // 传递错误给错误处理中间件
});
```

### 内置中间件
```javascript
const express = require('express');
const app = express();

// 1. 解析 JSON 请求体
app.use(express.json());

// 2. 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 3. 提供静态文件服务
app.use(express.static('public'));
```

### 第三方中间件
```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// 1. CORS 中间件
app.use(cors());

// 2. 日志中间件
app.use(morgan('combined'));

// 3. 安全头中间件
app.use(helmet());
```

## 3. 中间件封装实践

### 通用日志中间件
```javascript
// logger.js
class LoggerMiddleware {
  constructor(options = {}) {
    this.format = options.format || 'combined';
    this.level = options.level || 'info';
  }

  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // 监听响应结束事件
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          timestamp: new Date().toISOString()
        };
        
        this.log(logData);
      });
      
      next();
    };
  }

  log(data) {
    switch (this.level) {
      case 'debug':
        console.debug(JSON.stringify(data));
        break;
      case 'info':
        console.info(JSON.stringify(data));
        break;
      case 'warn':
        console.warn(JSON.stringify(data));
        break;
      case 'error':
        console.error(JSON.stringify(data));
        break;
      default:
        console.log(JSON.stringify(data));
    }
  }
}

module.exports = LoggerMiddleware;
```

### 认证中间件
```javascript
// auth.js
const jwt = require('jsonwebtoken');

class AuthMiddleware {
  constructor(options = {}) {
    this.secret = options.secret || process.env.JWT_SECRET;
    this.excludePaths = options.excludePaths || [];
  }

  middleware() {
    return (req, res, next) => {
      // 检查是否需要跳过认证
      if (this.shouldExclude(req.path)) {
        return next();
      }

      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: '访问令牌缺失' });
      }

      jwt.verify(token, this.secret, (err, user) => {
        if (err) {
          return res.status(403).json({ error: '令牌无效' });
        }
        
        req.user = user;
        next();
      });
    };
  }

  shouldExclude(path) {
    return this.excludePaths.some(excludePath => {
      if (typeof excludePath === 'string') {
        return path === excludePath;
      } else if (excludePath instanceof RegExp) {
        return excludePath.test(path);
      }
      return false;
    });
  }
}

module.exports = AuthMiddleware;
```

### 速率限制中间件
```javascript
// rateLimiter.js
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15分钟
    this.max = options.max || 100; // 最大请求数
    this.message = options.message || '请求过于频繁';
    this.store = new Map(); // 简单实现，生产环境应使用 Redis
  }

  middleware() {
    return (req, res, next) => {
      const key = this.getKey(req);
      const now = Date.now();
      const windowStart = now - this.windowMs;

      if (!this.store.has(key)) {
        this.store.set(key, []);
      }

      const requests = this.store.get(key);
      
      // 清理过期的请求记录
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      // 检查是否超过限制
      if (validRequests.length >= this.max) {
        return res.status(429).json({ 
          error: this.message,
          retryAfter: this.windowMs 
        });
      }

      // 记录当前请求
      validRequests.push(now);
      this.store.set(key, validRequests);

      // 设置响应头
      res.set('X-RateLimit-Limit', this.max);
      res.set('X-RateLimit-Remaining', this.max - validRequests.length - 1);
      res.set('X-RateLimit-Reset', new Date(now + this.windowMs).toISOString());

      next();
    };
  }

  getKey(req) {
    // 可以根据 IP、用户 ID 等生成键
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  }

  // 清理过期数据的定时任务
  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, requests] of this.store.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, validRequests);
      }
    }
  }
}

module.exports = RateLimiter;
```

### 请求验证中间件
```javascript
// validator.js
const { body, validationResult } = require('express-validator');

class ValidationMiddleware {
  static validate(rules) {
    return [
      ...rules,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            error: '验证失败',
            details: errors.array()
          });
        }
        next();
      }
    ];
  }

  static userRegistration() {
    return ValidationMiddleware.validate([
      body('email')
        .isEmail()
        .withMessage('邮箱格式不正确')
        .normalizeEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('密码长度至少6位')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('密码必须包含大小写字母和数字'),
      body('name')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('姓名长度必须在1-50个字符之间')
    ]);
  }

  static userLogin() {
    return ValidationMiddleware.validate([
      body('email')
        .isEmail()
        .withMessage('邮箱格式不正确')
        .normalizeEmail(),
      body('password')
        .notEmpty()
        .withMessage('密码不能为空')
    ]);
  }
}

module.exports = ValidationMiddleware;
```

## 4. 中间件组合和复用

### 中间件工厂模式
```javascript
// middlewareFactory.js
class MiddlewareFactory {
  // 创建缓存中间件
  static createCacheMiddleware(options = {}) {
    const cache = new Map();
    const ttl = options.ttl || 60000; // 1分钟

    return (req, res, next) => {
      const key = req.originalUrl;
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return res.json(cached.data);
      }

      // 重写 res.send 方法来缓存响应
      const originalSend = res.send;
      res.send = function(data) {
        cache.set(key, {
          data: JSON.parse(data),
          timestamp: Date.now()
        });
        originalSend.call(this, data);
      };

      next();
    };
  }

  // 创建权限中间件
  static createPermissionMiddleware(permissions) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: '未认证' });
      }

      const userPermissions = req.user.permissions || [];
      const hasPermission = permissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ error: '权限不足' });
      }

      next();
    };
  }

  // 创建请求ID中间件
  static createRequestIdMiddleware() {
    return (req, res, next) => {
      req.requestId = this.generateRequestId();
      res.setHeader('X-Request-ID', req.requestId);
      next();
    };
  }

  static generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = MiddlewareFactory;
```

### 中间件组合器
```javascript
// middlewareComposer.js
class MiddlewareComposer {
  constructor() {
    this.middlewares = [];
  }

  // 添加中间件
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  // 条件性添加中间件
  useIf(condition, middleware) {
    if (condition) {
      this.middlewares.push(middleware);
    }
    return this;
  }

  // 根据环境添加中间件
  useInEnv(environment, middleware) {
    if (process.env.NODE_ENV === environment) {
      this.middlewares.push(middleware);
    }
    return this;
  }

  // 生成组合中间件
  compose() {
    return (req, res, next) => {
      let index = 0;

      const dispatch = (i) => {
        if (i <= index) {
          return Promise.reject(new Error('next() called multiple times'));
        }
        index = i;
        
        let fn = this.middlewares[i];
        if (i === this.middlewares.length) fn = next;
        if (!fn) return Promise.resolve();
        
        try {
          return Promise.resolve(fn(req, res, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      };

      return dispatch(0);
    };
  }
}

// 使用示例
const composer = new MiddlewareComposer();

const combinedMiddleware = composer
  .use(authMiddleware)
  .use(loggingMiddleware)
  .useIf(process.env.NODE_ENV === 'development', debugMiddleware)
  .compose();

app.use('/api', combinedMiddleware);
```

## 5. 实际应用示例

### 完整的中间件应用
```javascript
const express = require('express');
const app = express();

// 引入自定义中间件
const LoggerMiddleware = require('./middleware/logger');
const AuthMiddleware = require('./middleware/auth');
const RateLimiter = require('./middleware/rateLimiter');
const ValidationMiddleware = require('./middleware/validator');
const MiddlewareFactory = require('./middleware/middlewareFactory');

// 创建中间件实例
const logger = new LoggerMiddleware({ level: 'info' });
const auth = new AuthMiddleware({ 
  secret: process.env.JWT_SECRET,
  excludePaths: ['/api/auth/login', '/api/auth/register']
});
const rateLimiter = new RateLimiter({ max: 100, windowMs: 15 * 60 * 1000 });

// 应用中间件
app.use(logger.middleware());
app.use(express.json());
app.use(MiddlewareFactory.createRequestIdMiddleware());

// API 路由
const apiRouter = express.Router();

// 对所有 API 应用速率限制和认证
apiRouter.use(rateLimiter.middleware());
apiRouter.use(auth.middleware());

// 用户注册路由（带验证）
apiRouter.post(
  '/auth/register',
  ValidationMiddleware.userRegistration(),
  async (req, res) => {
    try {
      // 处理注册逻辑
      res.status(201).json({ message: '注册成功' });
    } catch (error) {
      res.status(500).json({ error: '注册失败' });
    }
  }
);

// 用户登录路由（带验证）
apiRouter.post(
  '/auth/login',
  ValidationMiddleware.userLogin(),
  async (req, res) => {
    try {
      // 处理登录逻辑
      res.json({ message: '登录成功' });
    } catch (error) {
      res.status(500).json({ error: '登录失败' });
    }
  }
);

// 受保护的用户资料路由
apiRouter.get('/profile', (req, res) => {
  res.json({
    user: req.user,
    requestId: req.requestId
  });
});

app.use('/api', apiRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('未处理的错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    requestId: req.requestId
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '页面未找到' });
});

app.listen(3000, () => {
  console.log('服务器启动在端口 3000');
  
  // 定期清理速率限制数据
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60000);
});
```

## 总结

中间件封装的核心要点：

1. **理解概念**：中间件是处理请求和响应的函数，可以修改请求/响应对象或结束请求
2. **类型分类**：应用级、路由级、错误处理、内置和第三方中间件
3. **封装原则**：
   - 单一职责原则
   - 可配置性
   - 可复用性
   - 错误处理
4. **最佳实践**：
   - 合理的执行顺序
   - 异步处理
   - 资源清理
   - 性能优化

通过良好的中间件设计，可以构建模块化、可维护的 Node.js 应用。