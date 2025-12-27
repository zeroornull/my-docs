---
title: Koa 中，中间件没有调用 await next()
---

在 Koa 中，如果一个中间件没有调用 `await next()`，那么后续的中间件**不会执行**。

## 详细解释

Koa 的中间件机制基于"洋葱模型"，每个中间件都可以决定是否继续执行后续中间件：

### 1. 正常情况（调用 await next()）

```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件1
app.use(async (ctx, next) => {
  console.log('middleware 1 start');
  await next(); // 调用下一个中间件
  console.log('middleware 1 end');
});

// 中间件2
app.use(async (ctx, next) => {
  console.log('middleware 2 start');
  await next(); // 调用下一个中间件
  console.log('middleware 2 end');
});

// 中间件3
app.use(async (ctx, next) => {
  console.log('middleware 3');
  ctx.body = 'Hello World';
});

app.listen(3000);
```

**输出结果：**
```
middleware 1 start
middleware 2 start
middleware 3
middleware 2 end
middleware 1 end
```

### 2. 不调用 await next() 的情况

```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件1
app.use(async (ctx, next) => {
  console.log('middleware 1 start');
  // 注意：这里没有调用 await next()
  console.log('middleware 1 end');
  ctx.body = 'Handled by middleware 1';
});

// 中间件2 - 永远不会执行
app.use(async (ctx, next) => {
  console.log('middleware 2 start');
  await next();
  console.log('middleware 2 end');
});

// 中间件3 - 永远不会执行
app.use(async (ctx, next) => {
  console.log('middleware 3');
  ctx.body = 'Hello World';
});

app.listen(3000);
```

**输出结果：**
```
middleware 1 start
middleware 1 end
```

### 3. 实际应用场景

不调用 `await next()` 的常见场景包括：

#### 认证中间件（认证失败时阻止后续执行）

```javascript
app.use(async (ctx, next) => {
  const token = ctx.headers.authorization;
  
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    // 不调用 next()，阻止后续中间件执行
    return;
  }
  
  // 验证 token...
  await next(); // 验证通过，继续执行
});
```

#### 缓存中间件（命中缓存时直接返回）

```javascript
app.use(async (ctx, next) => {
  const cacheKey = ctx.url;
  const cachedResponse = getFromCache(cacheKey);
  
  if (cachedResponse) {
    ctx.body = cachedResponse;
    // 命中缓存，直接返回，不执行后续中间件
    return;
  }
  
  await next(); // 未命中缓存，继续执行
  // 将响应结果存入缓存
  setToCache(cacheKey, ctx.body);
});
```

## 总结

- `await next()` 是控制权传递给下一个中间件的关键
- 如果不调用 `await next()`，请求处理流程会在此中间件结束，不会执行后续中间件
- 这是 Koa 洋葱模型的核心机制，允许中间件根据条件决定是否继续执行后续逻辑
- 这种机制常用于权限验证、缓存处理、错误处理等场景