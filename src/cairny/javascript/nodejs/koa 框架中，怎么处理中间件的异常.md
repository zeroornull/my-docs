---
title: koa 框架中，怎么处理中间件的异常
---

在 Koa 框架中，异常处理是一个重要的话题。Koa 提供了多种方式来处理中间件中的异常。

## 1. 使用 try/catch 处理异常

### 在中间件中直接处理异常

```javascript
const Koa = require('koa');
const app = new Koa();

// 基本的异常处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    };
    // 可选：记录错误日志
    console.error('Error occurred:', err);
  }
});

// 可能抛出异常的中间件
app.use(async (ctx, next) => {
  if (ctx.path === '/error') {
    throw new Error('Something went wrong!');
  }
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## 2. 使用 Koa 内置的 error 事件

```javascript
const Koa = require('koa');
const app = new Koa();

// 全局错误监听
app.on('error', (err, ctx) => {
  console.error('Server Error:', err, ctx);
  // 可以在这里记录日志、发送告警等
});

app.use(async (ctx, next) => {
  // 这里的错误会被上面的 error 事件捕获
  throw new Error('Test error');
});

app.listen(3000);
```

## 3. 创建专门的错误处理中间件

```javascript
const Koa = require('koa');
const app = new Koa();

// 专门的错误处理中间件
function errorHandler() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 设置默认状态码
      ctx.status = err.status || 500;
      
      // 根据环境返回不同的错误信息
      if (process.env.NODE_ENV === 'development') {
        ctx.body = {
          message: err.message,
          stack: err.stack,
          status: ctx.status
        };
      } else {
        ctx.body = {
          message: err.message || 'Internal Server Error',
          status: ctx.status
        };
      }
      
      // 记录错误日志
      ctx.app.emit('error', err, ctx);
    }
  };
}

// 自定义错误类
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

app.use(errorHandler());

app.use(async (ctx, next) => {
  if (ctx.path === '/not-found') {
    throw new HttpError(404, 'Resource not found');
  }
  
  if (ctx.path === '/server-error') {
    throw new HttpError(500, 'Internal server error');
  }
  
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## 4. 处理异步操作中的异常

```javascript
const Koa = require('koa');
const fs = require('fs').promises;
const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Caught error:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/read-file') {
    // 异步操作中的错误也会被捕获
    const data = await fs.readFile('non-existent-file.txt', 'utf8');
    ctx.body = data;
  }
  
  await next();
});

app.listen(3000);
```

## 5. 使用中间件库处理错误

```javascript
const Koa = require('koa');
const app = new Koa();

// 使用 koa-json-error 中间件
const error = require('koa-json-error');

app.use(error({
  postFormat: (e, obj) => {
    // 生产环境不显示错误堆栈
    return process.env.NODE_ENV === 'production' ? 
      { ...obj, stack: undefined } : 
      obj;
  }
}));

app.use(async (ctx, next) => {
  if (ctx.path === '/error') {
    throw new Error('Something bad happened');
  }
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## 6. 完整的错误处理方案

```javascript
const Koa = require('koa');
const app = new Koa();

// 自定义错误类
class APIError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
    
    // 处理 404 错误
    if (ctx.status === 404 && ctx.body === undefined) {
      ctx.status = 404;
      ctx.body = { error: 'Not Found' };
    }
  } catch (err) {
    // 记录错误
    ctx.app.emit('error', err, ctx);
    
    // 处理不同类型的错误
    if (err instanceof APIError) {
      ctx.status = err.status;
      ctx.body = {
        error: err.message,
        code: err.code
      };
    } else if (err.isJoi) {
      // Joi 验证错误
      ctx.status = 400;
      ctx.body = {
        error: 'Validation Error',
        details: err.details
      };
    } else {
      // 其他错误
      ctx.status = err.status || 500;
      ctx.body = {
        error: process.env.NODE_ENV === 'development' ? 
          err.message : 
          'Internal Server Error'
      };
    }
  }
});

// 全局错误监听
app.on('error', (err, ctx) => {
  // 生产环境记录错误日志
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      url: ctx.url,
      method: ctx.method,
      ip: ctx.ip
    });
  }
});

// 示例路由
app.use(async (ctx, next) => {
  if (ctx.path === '/api-error') {
    throw new APIError(400, 'Bad Request', 'INVALID_PARAMS');
  }
  
  if (ctx.path === '/server-error') {
    throw new Error('Database connection failed');
  }
  
  ctx.body = { message: 'Success' };
});

app.listen(3000);
```

## 7. 错误处理最佳实践

### 创建错误处理工具函数

```javascript
// error-utils.js
class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const createError = (message, status, code) => {
  return new AppError(message, status, code);
};

module.exports = { AppError, createError };
```

### 使用示例

```javascript
const Koa = require('koa');
const { createError } = require('./error-utils');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.status;
      ctx.body = {
        error: err.message,
        code: err.code
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: 'Internal Server Error'
      };
      console.error('Unexpected error:', err);
    }
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/bad-request') {
    throw createError('Invalid request parameters', 400, 'INVALID_PARAMS');
  }
  
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## 总结

Koa 中处理中间件异常的主要方式包括：

1. **try/catch 包裹** - 最基本的异常捕获方式
2. **error 事件监听** - 全局错误监听和处理
3. **专门的错误处理中间件** - 统一处理所有异常
4. **自定义错误类** - 更好地分类和处理不同类型的错误
5. **第三方中间件** - 如 koa-json-error 等

关键原则是：
- 在最外层中间件中捕获所有未处理的异常
- 根据环境（开发/生产）返回适当的错误信息
- 记录错误日志以便调试和监控
- 使用自定义错误类来区分不同类型的错误