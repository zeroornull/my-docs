---
title: cookie讲解
---

## Cookie 详解

Cookie 是一种小型的文本文件，由服务器发送给浏览器并存储在用户计算机上。当用户再次访问该网站时，浏览器会将 Cookie 发送回服务器，用于识别用户身份、存储用户偏好等用途。

### Cookie 的基本特性

1. **大小限制**：每个 Cookie 通常限制在 4KB 左右
2. **数量限制**：每个域名下通常只能存储 20-50 个 Cookie
3. **域名绑定**：Cookie 只能被创建它的域名访问
4. **自动发送**：浏览器会在每次请求时自动将相关 Cookie 发送到服务器

### Cookie 的主要属性

#### 1. `name` 和 `value`
- `name`：Cookie 的名称
- `value`：Cookie 的值

```javascript
// 设置一个简单的 Cookie
document.cookie = "username=JohnDoe";
```

#### 2. `expires` 和 `max-age`
控制 Cookie 的过期时间：

```javascript
// 使用 expires 设置过期时间（GMT 格式）
document.cookie = "sessionid=abc123; expires=Thu, 18 Dec 2025 12:00:00 GMT";

// 使用 max-age 设置过期时间（秒数）
document.cookie = "preferences=dark-mode; max-age=3600"; // 1小时后过期
```

#### 3. `domain`
指定 Cookie 可以被访问的域名：

```javascript
// 仅当前域名可访问
document.cookie = "userPref=lang_en; domain=example.com";

// 子域名也可访问
document.cookie = "sessionId=xyz789; domain=.example.com";
```

#### 4. `path`
指定 Cookie 可以被访问的路径：

```javascript
// 仅 /admin 路径及其子路径可访问
document.cookie = "adminToken=secret123; path=/admin";

// 所有路径都可访问
document.cookie = "theme=dark; path=/";
```

#### 5. `secure`
指定 Cookie 只能通过 HTTPS 协议传输：

```javascript
// 仅在 HTTPS 连接中发送
document.cookie = "authToken=securetoken; secure; path=/";
```

#### 6. `httpOnly`
防止客户端脚本访问 Cookie（只能由服务器设置）：

```javascript
// 通过 HTTP 响应头设置（服务器端）
// Set-Cookie: sessionId=hijacked; HttpOnly; Secure
```

#### 7. `SameSite`
控制 Cookie 在跨站请求中的发送行为：

```javascript
// Strict：仅同站请求发送
document.cookie = "strictCookie=value; SameSite=Strict";

// Lax：大多数同站请求发送（默认行为）
document.cookie = "laxCookie=value; SameSite=Lax";

// None：所有请求都发送（需要 secure 属性）
document.cookie = "crossSiteCookie=value; SameSite=None; Secure";
```

### 完整示例

```javascript
// 设置一个带有多个属性的 Cookie
document.cookie = "userSettings=theme-dark_lang-en; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/; domain=.example.com; secure; SameSite=Lax";

// 读取 Cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// 删除 Cookie（设置过期时间为过去）
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// 使用示例
const userSettings = getCookie("userSettings");
console.log(userSettings); // 输出: theme-dark_lang-en

deleteCookie("userSettings");
```

### Cookie 的应用场景

1. **用户身份认证**：存储会话 ID 或认证令牌
2. **用户偏好设置**：保存语言、主题等个性化设置
3. **购物车信息**：在用户未登录时保存购物车内容
4. **跟踪分析**：记录用户行为用于分析

### 注意事项

- Cookie 会在每次 HTTP 请求中发送，影响性能
- 敏感信息不应存储在 Cookie 中
- 需要遵守相关隐私法规（如 GDPR）
- 现代应用更多使用 Web Storage（localStorage/sessionStorage）替代 Cookie 存储数据


## 设置 Cookie 仅在 HTTPS 时携带

要设置 Cookie 只在 HTTPS 连接中传输，需要使用 `Secure` 属性。以下是详细的设置方法：

### 1. 基本语法

```javascript
document.cookie = "name=value; Secure";
```

### 2. 实际示例

```javascript
// 设置一个仅在 HTTPS 下传输的 Cookie
document.cookie = "sessionId=abc123xyz; Secure";

// 结合其他属性一起使用
document.cookie = "authToken=secretToken123; Secure; HttpOnly; SameSite=Strict; Path=/";

// 设置带过期时间的安全 Cookie
document.cookie = "userPref=darkTheme; Secure; Expires=Wed, 01 Jan 2025 00:00:00 GMT";
```

### 3. 服务器端设置（推荐方式）

虽然客户端 JavaScript 也可以设置 `Secure` 属性，但最佳实践是在服务器端通过 HTTP 响应头设置：

#### Node.js/Express 示例：
```javascript
res.cookie('sessionId', 'abc123xyz', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
});
```

#### PHP 示例：
```php
setcookie("sessionId", "abc123xyz", [
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict'
]);
```

#### Java Servlet 示例：
```java
Cookie cookie = new Cookie("sessionId", "abc123xyz");
cookie.setSecure(true);
cookie.setHttpOnly(true);
cookie.setPath("/");
response.addCookie(cookie);
```

### 4. Secure 属性的重要特性

- **HTTPS 必须**：标记为 `Secure` 的 Cookie 只会在 HTTPS 连接中发送
- **自动保护**：浏览器会自动阻止这些 Cookie 在 HTTP 连接中传输
- **开发注意**：在本地开发时（localhost），即使没有 HTTPS，大多数浏览器也允许设置和发送 Secure Cookie

### 5. 完整的安全 Cookie 设置示例

```javascript
// 创建一个高度安全的 Cookie
function setSecureCookie(name, value, daysToExpire) {
    let expires = "";
    if (daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        expires = "; Expires=" + date.toUTCString();
    }
    
    // 仅在 HTTPS 下传输，并防止 XSS 攻击
    document.cookie = name + "=" + value + expires + "; Secure; HttpOnly; SameSite=Strict; Path=/";
}

// 使用示例
setSecureCookie("sessionId", "abc123xyz", 7); // 7天过期的安全 Cookie
```

### 6. 检查当前连接是否为 HTTPS

```javascript
// 检查当前是否为 HTTPS 连接
if (location.protocol === 'https:') {
    // 可以安全地设置 Secure Cookie
    document.cookie = "secureData=value; Secure";
} else {
    console.warn("当前不是 HTTPS 连接，无法设置 Secure Cookie");
}
```

### 重要提醒

1. **Secure Cookie 只能在 HTTPS 页面上设置**：如果尝试在 HTTP 页面上设置带有 `Secure` 属性的 Cookie，大多数浏览器会忽略该 Cookie
2. **本地开发例外**：在 localhost 上，即使没有 HTTPS，浏览器通常也允许设置和发送 Secure Cookie，以便于开发测试
3. **配合 HttpOnly 使用**：为了更好的安全性，建议同时使用 `HttpOnly` 属性防止 XSS 攻击
4. **SameSite 属性**：现代浏览器推荐同时设置 `SameSite` 属性来防止 CSRF 攻击

通过以上方法，你可以确保 Cookie 只在安全的 HTTPS 连接中传输，从而保护用户数据的安全性。