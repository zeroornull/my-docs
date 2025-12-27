---
title: fetch和axios的区别
----

`fetch` 和 `axios` 都是用于在前端发起 HTTP 请求的工具，但它们在功能、使用方式以及兼容性等方面有显著区别。下面将从多个维度详细对比它们，并给出使用示例。

---

## 一、基本区别

| 特性 | `fetch` | `axios` |
|------|---------|---------|
| 原生支持 | 是（现代浏览器） | 否（需引入库） |
| 支持 IE | 否 | 否（除非使用 polyfill） |
| 请求类型 | 原生支持 GET、POST 等 | 支持所有 HTTP 方法（GET、POST、PUT、DELETE 等） |
| 默认不带 cookie | 是 | 否（可配置） |
| 自动转换 JSON | 否（需手动调用 `.json()`） | 是 |
| 请求拦截/响应拦截 | 不支持 | 支持 |
| 取消请求 | 需配合 `AbortController` | 内置支持（通过 `CancelToken`） |
| 浏览器和 Node.js 支持 | 浏览器原生支持 | 支持浏览器和 Node.js（统一 API） |

---

## 二、使用示例对比

### 1. 使用 `fetch` 发起 GET 请求

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('There was an error!', error));
```

### 2. 使用 `axios` 发起 GET 请求

```javascript
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => {
    if (error.response) {
      // 请求已发出，服务器响应状态码不在 2xx 范围
      console.log('Server responded with:', error.response.status);
    } else if (error.request) {
      // 请求已发出但未收到响应
      console.log('No response received:', error.request);
    } else {
      // 其他错误
      console.log('Error:', error.message);
    }
  });
```

### 3. 使用 `axios` 拦截请求和响应

```javascript
// 请求拦截器
axios.interceptors.request.use(config => {
  console.log('Request is being sent:', config);
  return config;
});

// 响应拦截器
axios.interceptors.response.use(response => {
  console.log('Response received:', response);
  return response;
});
```

### 4. 使用 `axios` 取消请求

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/1', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理其他错误
  }
});

source.cancel('Operation canceled by the user.');
```

---

## 三、适用场景建议

| 场景 | 推荐工具 |
|------|----------|
| 简单的请求，不需要拦截器或取消机制 | `fetch` |
| 需要拦截器、自动 JSON 转换、统一错误处理 | `axios` |
| 需要在 Node.js 中使用 | `axios` |
| 需要兼容旧浏览器（如 IE） | `axios` + polyfill 或 jQuery.ajax |
| 需要更细粒度控制请求生命周期（如取消） | `axios` |

---

## 四、总结

- `fetch` 是现代浏览器内置的 API，使用简单但功能有限。
- `axios` 是一个功能强大的第三方库，适用于复杂场景，支持拦截器、取消请求、自动 JSON 转换等。
- 如果项目需要高级功能，推荐使用 `axios`；如果只是简单的请求，`fetch` 已足够。

如需在项目中引入 `axios`，可以通过 npm 安装：

```bash
npm install axios
```