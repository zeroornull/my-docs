---
title: Cache-Control 有哪些常见配置值
---

## Cache-Control 常见配置值详解

`Cache-Control` 是 HTTP/1.1 中用于控制缓存行为的重要头部字段，它定义了请求和响应的缓存机制。

### 主要指令类型

#### 1. 可缓存性指令

- **`public`**
  - 表示响应可以被任何缓存存储，包括私有和共享缓存
  - 适用于可以被多个用户共享的资源

- **`private`**
  - 表示响应只能被单个用户缓存，不能存储在共享缓存中
  - 通常用于包含用户个人信息的响应

- **`no-cache`**
  - 强制缓存在使用缓存副本前必须向源服务器验证资源是否更新
  - 不意味着"不缓存"，而是需要验证后才能使用

- **`no-store`**
  - 禁止任何缓存存储响应内容
  - 适用于包含敏感信息的响应

#### 2. 到期指令

- **`max-age=<seconds>`**
  - 指定资源在缓存中的最大存活时间（以秒为单位）
  - 例如：`Cache-Control: max-age=3600` 表示缓存1小时

- **`s-maxage=<seconds>`**
  - 仅适用于共享缓存（如 CDN），优先级高于 `max-age`
  - 用于控制 CDN 等共享缓存的过期时间

- **`max-stale=<seconds>`**
  - 允许客户端接受已过期的缓存响应
  - 可指定过期后仍可使用的最大时间

- **`min-fresh=<seconds>`**
  - 要求缓存响应在指定时间内仍然新鲜
  - 确保在使用时还有足够的新鲜时间

#### 3. 重新验证和重新加载指令

- **`must-revalidate`**
  - 缓存必须在使用过期缓存前向源服务器重新验证
  - 保证过期后必须重新获取资源

- **`proxy-revalidate`**
  - 类似于 `must-revalidate`，但仅适用于共享缓存
  - 确保代理服务器必须重新验证缓存

#### 4. 其他指令

- **`no-transform`**
  - 禁止代理服务器修改响应内容
  - 防止压缩、格式转换等操作

- **`immutable`**
  - 表示响应内容不会改变
  - 在 `max-age` 期间内不需要重新验证

- **`stale-while-revalidate=<seconds>`**
  - 允许在后台重新验证时继续使用过期缓存
  - 提供更好的用户体验

- **`stale-if-error=<seconds>`**
  - 在源服务器返回错误时允许使用过期缓存

### 常见组合配置示例

```http
# 静态资源缓存1年
Cache-Control: public, max-age=31536000

# 需要验证的私有缓存
Cache-Control: private, no-cache

# 禁止缓存
Cache-Control: no-cache, no-store, must-revalidate

# CDN缓存控制
Cache-Control: public, max-age=3600, s-maxage=7200

# 后台更新缓存
Cache-Control: public, max-age=300, stale-while-revalidate=30
```

### 使用注意事项

- 指令之间用逗号分隔
- `no-cache` 和 `no-store` 有不同的含义和用途
- 合理设置缓存时间可以提高性能并保证内容新鲜度
- 需要根据资源类型和业务需求选择合适的缓存策略