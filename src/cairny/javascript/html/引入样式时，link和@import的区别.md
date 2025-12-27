---
title: 引入样式时，link和@import的区别
---

在CSS中引入样式表时，`<link>` 和 `@import` 是两种常用的方式，它们有一些关键的区别：

## 1. 语法和使用方式

- **`<link>`**：HTML标签，在HTML文档的 `<head>` 部分使用
```html
<link rel="stylesheet" href="styles.css">
```

- **`@import`**：CSS规则，在CSS文件或 `<style>` 标签内使用
```css
@import url('styles.css');
```

## 2. 加载性能差异

- **`<link>`**：
  - 支持并行加载多个CSS文件
  - HTML解析和CSS加载可以同时进行
  - 页面渲染速度更快

- **`@import`**：
  - 必须等待前一个CSS文件加载完成后才能加载下一个
  - 可能导致页面渲染阻塞
  - 加载速度相对较慢

## 3. 浏览器兼容性

- **`<link>`**：
  - 所有浏览器都支持
  - 兼容性极佳

- **`@import`**：
  - CSS2.1引入的功能
  - 老版本IE浏览器支持有限
  - 在CSS文件中使用时需注意兼容性问题

## 4. 使用灵活性

- **`<link>`**：
  - 可以添加 `media` 属性指定媒体类型
  - 可以添加 title 属性指定样式表标题
  - 可以使用 `alternate` 实现可选样式表

```html
<link rel="stylesheet" href="print.css" media="print">
<link rel="alternate stylesheet" href="dark.css" title="Dark Mode">
```

- **`@import`**：
  - 也可以指定媒体类型，但语法相对复杂
  - 灵活性不如 `<link>` 标签

```css
@import url('mobile.css') screen and (max-width: 768px);
```

## 5. DOM操作能力

- **`<link>`**：
  - 可以通过JavaScript动态操作DOM元素
  - 可以监听加载事件
  - 更容易进行动态样式管理

- **`@import`**：
  - 无法直接通过JavaScript控制
  - 不便于动态样式切换

## 总结建议

**推荐使用 `<link>` 标签**，因为它具有以下优势：

- 更好的性能表现
- 更强的浏览器兼容性
- 更丰富的功能选项
- 更好的可维护性和可操作性

只有在特殊情况下（如CSS文件内必须引用其他CSS文件）才考虑使用 `@import`。

