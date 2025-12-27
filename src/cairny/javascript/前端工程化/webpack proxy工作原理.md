---
title: webpack proxy工作原理
---

## Webpack Proxy 工作原理

### 1. 基本概念
Webpack Proxy 是 `webpack-dev-server` 提供的一个开发时功能，它允许将特定的请求代理到其他服务器。

### 2. 工作机制
- **中间层代理**: 当你在开发环境中发起请求时，请求首先发送到 webpack-dev-server（通常是 localhost:8080）
- **请求转发**: webpack-dev-server 根据配置的 proxy 规则，将匹配的请求转发到目标服务器
- **响应返回**: 目标服务器返回响应给 webpack-dev-server，再由 webpack-dev-server 返回给浏览器

```javascript
// 示例配置
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

### 3. 为什么能解决跨域问题

#### 跨域限制的来源
- 浏览器的**同源策略**限制了前端 JavaScript 向不同域发送请求
- 同源要求：协议、域名、端口都必须相同

#### Proxy 解决方案
- **统一源**: 所有请求都发送到 webpack-dev-server（同源），避免了跨域
- **服务端转发**: webpack-dev-server 作为中间代理服务器向目标服务器发起请求
- **无跨域限制**: 服务端请求不受同源策略限制

### 4. 请求流程对比

**不使用 Proxy（跨域问题）**:
```
浏览器 (localhost:8080) → API服务器 (localhost:3000) ❌ 跨域被阻止
```

**使用 Proxy（解决跨域）**:
```
浏览器 (localhost:8080) 
    ↓
webpack-dev-server (localhost:8080) → API服务器 (localhost:3000) ✅
    ↓
浏览器 (localhost:8080)
```

### 5. 关键配置选项

- `target`: 目标服务器地址
- `changeOrigin`: 是否改变请求头中的 origin 字段
- `pathRewrite`: 路径重写规则
- `secure`: 是否验证 SSL 证书

这种代理机制只在开发环境中有效，生产环境需要后端配置 CORS 或其他跨域解决方案。