---
title: 如何处理 JS 错误
---


##### 1. try-catch-finally 语句
最基本的错误处理结构：
```javascript
try {
  // 可能抛出错误的代码
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  // 处理错误
  console.error('发生错误:', error.message);
} finally {
  // 无论是否发生错误都会执行的代码
  console.log('操作尝试完成');
}
```

##### 2. 错误对象
JavaScript 错误通常是 Error 对象的实例，包含以下属性：

* name: 错误类型名称

* message: 错误描述信息

* stack: 错误堆栈跟踪（非标准但广泛支持）

常见内置错误类型：

* Error - 通用错误

* SyntaxError - 语法错误

* TypeError - 类型错误

* ReferenceError - 引用错误

* RangeError - 范围错误
  

##### 3. 抛出自定义错误
```javascript
function validateInput(input) {
  if (!input) {
    throw new Error('输入不能为空');
  }
  if (input.length < 5) {
    throw new Error('输入长度必须至少5个字符');
  }
}

try {
  validateInput('');
} catch (error) {
  console.error('验证失败:', error.message);
}
```

##### 4. Promise 错误处理
对于异步操作，Promise 使用 .catch() 或 try-catch 与 async/await：
```javascript
// 使用 .catch()
fetch('https://api.example.com/data')
  .then(response => response.json())
  .catch(error => console.error('请求失败:', error));

// 使用 async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error; // 可以选择重新抛出
  }
}
```

##### 5. 全局错误处理
* 浏览器环境：
```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  // 可以在这里记录错误到服务器
});

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
});
```

* Node.js 环境：
```javascript
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  // 通常应该记录错误并优雅地退出
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
```


##### 6. 错误处理最佳实践
* 具体错误处理：捕获特定错误类型而不是所有错误
```javascript
try {
  // ...
} catch (error) {
  if (error instanceof TypeError) {
    // 处理类型错误
  } else if (error instanceof RangeError) {
    // 处理范围错误
  } else {
    // 处理其他错误
  }
}
```

* 不要静默吞噬错误：至少记录错误

* 适当重新抛出错误：如果当前上下文无法处理错误，应该重新抛出

* 提供有意义的错误信息：帮助调试和维护

* 前端错误监控：考虑使用 Sentry、Bugsnag 等工具

* 防御性编程：使用可选链 (?.) 和空值合并 (??) 等现代 JS 特性
