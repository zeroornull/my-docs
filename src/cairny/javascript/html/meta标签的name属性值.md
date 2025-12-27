---
title: meta标签的name属性值
---

## meta标签name属性详解

`meta` 标签的 name 属性用于定义文档级元数据的名称，这些元数据通常不显示在页面上，但会被浏览器、搜索引擎和其他网络服务使用。

### 常见的name属性值分类

#### 1. 基本文档描述元数据

- **description**: 页面内容的简短描述，常用于搜索引擎结果展示
  ```html
  <meta name="description" content="这是一个关于网页开发技术的教程">
  ```

- **`keywords`**: 页面关键词，用于SEO（搜索引擎优化）
  ```html
  <meta name="keywords" content="HTML,CSS,JavaScript,Web开发">
  ```

- **author**: 页面作者信息
  ```html
  <meta name="author" content="张三">
  ```

- **`generator`**: 生成页面的软件或工具
  ```html
  <meta name="generator" content="WordPress 5.8">
  ```

#### 2. viewport相关元数据

- **`viewport`**: 控制页面在移动设备上的显示方式
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

#### 3. 机器人控制元数据

- **`robots`**: 指示搜索引擎爬虫如何处理页面
  ```html
  <meta name="robots" content="index,follow">
  <!-- 其他可选值: noindex, nofollow, noarchive -->
  ```

#### 4. 社交媒体元数据

- **`twitter:card`**: Twitter卡片信息
  ```html
  <meta name="twitter:card" content="summary_large_image">
  ```

- **`og:title`**, **`og:description`**, **`og:image`** 等Open Graph协议元数据
  ```html
  <meta name="og:title" content="页面标题">
  ```

#### 5. 应用程序相关元数据

- **`application-name`**: Web应用程序名称
  ```html
  <meta name="application-name" content="我的Web应用">
  ```

- **`theme-color`**: 浏览器工具栏主题颜色（注意：这是name属性，不是charset）
  ```html
  <meta name="theme-color" content="#4285f4">
  ```

#### 6. 其他常用元数据

- **`referrer`**: 控制HTTP请求中的Referer头信息
  ```html
  <meta name="referrer" content="no-referrer">
  ```

- **`color-scheme`**: 指定页面支持的颜色方案
  ```html
  <meta name="color-scheme" content="light dark">
  ```

- **`format-detection`**: 控制iOS Safari对电话号码等的自动识别
  ```html
  <meta name="format-detection" content="telephone=no">
  ```

### 重要说明

1. **自定义name值**: 除了标准定义的name值外，开发者还可以自定义name属性值，但需要确保这些自定义元数据有相应的处理程序。

2. **与http-equiv的区别**: name 属性用于定义文档元数据的名称，而 `http-equiv` 属性用于模拟HTTP响应头。

3. **配合content属性使用**: name 属性通常与 `content` 属性配合使用，`content` 属性提供对应元数据的具体值。

这些元数据虽然对用户不可见，但在SEO优化、移动端适配、社交媒体分享等方面发挥着重要作用。