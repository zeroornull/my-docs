---
title: src与href的区别
---

## `src` 与 `href` 的区别详解

### 1. 基本定义

- **`src` (source)**：表示资源的来源，用于**替换**当前元素
- **`href` (hypertext reference)**：表示超文本引用，用于建立**链接**关系

### 2. 使用场景对比

#### `src` 属性的使用场景：

- `<img src="image.jpg">` - 引入图片资源
- `<script src="script.js">` - 引入外部JavaScript文件
- `<iframe src="page.html">` - 嵌入其他HTML页面
- `<audio src="music.mp3">` - 引入音频资源
- `<video src="movie.mp4">` - 引入视频资源

#### `href` 属性的使用场景：

- `<a href="https://example.com">` - 超链接
- `<link href="style.css">` - 引入外部CSS样式表
- `<link href="favicon.ico">` - 网站图标

### 3. 加载行为差异

#### `src` 的特点：
```html
<img src="image.jpg" alt="图片">
```
- 浏览器会**下载并加载** `src` 指定的资源
- 资源会**替换或嵌入**到当前元素中
- 页面加载时会**阻塞**后续内容，直到资源加载完成（如 `<script src="">`）

#### `href` 的特点：
```html
<a href="page.html">跳转链接</a>
<link href="style.css" rel="stylesheet">
```
- 建立与资源的**关联关系**
- 不会替换当前元素内容
- 多数情况下**不阻塞**页面渲染

### 4. 对页面加载的影响

- **`src` 资源**：
  - 会阻塞页面渲染（特别是 `<script src="">`）
  - 必须等待资源加载完成才能继续

- **`href` 资源**：
  - CSS文件会阻塞渲染但不阻塞HTML解析
  - 超链接不会影响页面加载过程

### 5. 实际应用示例

```html
<!-- 使用 src - 资源嵌入到元素中 -->
<script src="main.js"></script>
<img src="logo.png" alt="Logo">

<!-- 使用 href - 建立链接关系 -->
<link href="styles.css" rel="stylesheet">
<a href="about.html">关于我们</a>
```

### 6. 错误处理方式

- **`src` 加载失败**：元素会显示默认的错误状态（如图片显示破裂图标）
- **`href` 加载失败**：通常不会影响当前页面显示，只是链接无法正常工作

### 总结

`src` 和 `href` 的核心区别在于：`src` 是**替换性**的资源引入，而 `href` 是**关联性**的资源引用。理解这个根本区别有助于正确使用这两个属性。