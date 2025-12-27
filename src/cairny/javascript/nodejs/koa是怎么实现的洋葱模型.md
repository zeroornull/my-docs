---
title: koa是怎么实现的洋葱模型
---

在没有 `async/await` 之前，Koa 使用 `Generator Function`（生成器函数）和 `co` 库来实现洋葱模型。

## Koa 1.x 的实现方式

### 1. Generator 函数 + co 库

Koa 1.x 基于 Generator 函数和 `co` 库来实现异步流程控制：

```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件使用 Generator 函数
app.use(function* (next) {
  console.log('middleware 1 start');
  yield next; // 使用 yield 而不是 await
  console.log('middleware 1 end');
});

app.use(function* (next) {
  console.log('middleware 2 start');
  yield next;
  console.log('middleware 2 end');
});

app.use(function* (next) {
  console.log('middleware 3');
  this.body = 'Hello World';
});

app.listen(3000);
```

### 2. 核心原理

Koa 1.x 内部使用 `co` 库来执行 Generator 函数：

```javascript
// 简化的 Koa 1.x 中间件执行机制
function compose(middleware) {
  return function* (next) {
    let index = -1;
    return yield dispatch(0);
    
    function* dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      
      if (!fn) return;
      
      // 使用 yield 来等待异步操作
      return yield fn.call(this, dispatch.bind(null, i + 1));
    }
  };
}
```

### 3. 手动实现洋葱模型（Generator 版本）

```javascript
// 模拟 Koa 1.x 的中间件机制
function compose(middlewares) {
  return function* (ctx, next) {
    return yield dispatch(0);
    
    function* dispatch(i) {
      const fn = middlewares[i] || next;
      if (!fn) return;
      
      // 关键：将 next 传递给当前中间件
      return yield fn(ctx, dispatch.bind(null, i + 1));
    }
  };
}

// 使用示例
const middlewares = [];

middlewares.push(function* (ctx, next) {
  console.log('middleware 1 start');
  yield next;
  console.log('middleware 1 end');
});

middlewares.push(function* (ctx, next) {
  console.log('middleware 2 start');
  yield next;
  console.log('middleware 2 end');
});

middlewares.push(function* (ctx, next) {
  console.log('middleware 3');
  ctx.body = 'Hello World';
});

// 执行中间件
const generator = compose(middlewares);
const ctx = {};
const co = require('co'); // 需要引入 co 库

co(generator(ctx)).then(() => {
  console.log('所有中间件执行完毕');
});
```

### 4. co 库的工作原理

`co` 库会自动执行 Generator 函数，处理其中的异步操作：

```javascript
// co 库的简化实现原理
function co(gen) {
  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') gen = gen();
    
    if (!gen || typeof gen.next !== 'function') {
      return resolve(gen);
    }
    
    onFulfilled();
    
    function onFulfilled(res) {
      let ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      
      next(ret);
    }
    
    function onRejected(err) {
      let ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      
      // 将 yield 的值转换为 Promise
      const value = toPromise(ret.value);
      if (value && isPromise(value)) {
        return value.then(onFulfilled, onRejected);
      }
      
      // 递归处理
      return onFulfilled(value);
    }
  });
}

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}
```

### 5. 错误处理机制

```javascript
// Koa 1.x 错误处理示例
app.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = { error: err.message };
    this.app.emit('error', err, this);
  }
});

app.use(function* (next) {
  throw new Error('Something went wrong');
  yield next;
});
```

## 与现代 Koa 2.x 的对比

| 特性 | Koa 1.x (Generator) | Koa 2.x (async/await) |
|------|-------------------|---------------------|
| 异步语法 | Generator + yield | async/await |
| 依赖库 | co | 原生支持 |
| 性能 | 较低 | 更高 |
| 可读性 | 较差 | 更好 |
| 兼容性 | 需要 Node.js 支持 | 需要 Node.js 7.6+ |

## 总结

Koa 1.x 通过 Generator 函数和 co 库实现了洋葱模型：
1. Generator 函数提供了暂停和恢复执行的能力
2. co 库自动处理 Generator 的执行和异步操作
3. 通过 `yield next` 实现中间件的串联执行
4. 这种方式虽然有效，但不如现代的 async/await 简洁易懂

当 async/await 成为主流后，Koa 2.x 迁移到了基于 Promise 的现代异步语法，提供了更好的性能和可读性。