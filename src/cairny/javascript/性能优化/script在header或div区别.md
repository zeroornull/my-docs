---
title: script在header或div区别
---


##### 放在 `<head>` 里
```html
<head>
  <script src="script.js"></script>
</head>
```

* 特点：
  * **阻塞渲染：** 浏览器会暂停解析HTML，先下载并执行脚本，导致页面渲染延迟（尤其是外部脚本较大或网络慢时）。
  * **执行顺序：** 脚本在DOM加载前执行，若脚本依赖DOM元素（如document.getElementById），可能因元素未加载而报错。

* 适用场景：
    * 需提前执行的脚本（如全局配置、Polyfill）。
    * 使用**defer** 或**async** 属性异步加载脚本（见下文补充）。


##### 放在 `<body>` 底部（`</body>`前）
```html
<body>
  <!-- 页面内容 -->
  <script src="script.js"></script>
</body>
```

* 特点：
    * **不阻塞渲染：** 浏览器优先加载和渲染页面内容，最后加载脚本，提升用户体验。
    * **DOM可操作：** 脚本执行时DOM已完全解析，可直接操作DOM元素。

* 适用场景：
    * 大多数需要操作DOM的脚本。
    * 对性能敏感的页面。


##### 关键差异总结
| 特性     | `<head>` 中的脚本         | `<body>` 底部的脚本 |
| -------- | ----------------------- | ----------------- |
| 渲染阻塞 | 是（除非用async/defer） | 否                |
| DOM访问  | 可能报错（元素未加载）  | 安全（DOM已就绪） |
| 执行时机 | 早于DOM加载             | 晚于DOM加载       |
| 适用场景 | 需提前执行的代码        | DOM操作、性能优化 |


##### 补充：async 和 defer 属性
若脚本必须放在`<head>`中，可通过以下属性优化：
* **async：** 异步下载，下载完成后立即执行（不保证顺序）。
```javascript
<head>
  <script async src="script.js"></script>
</head>
```

* **defer：** 异步下载，延迟到DOM解析完成后按顺序执行。
```javascript
<head>
  <script defer src="script.js"></script>
</head>
```

##### 最佳实践建议
* 常规DOM操作：将脚本放在`<body>`底部。
* 关键前置逻辑：用defer放在`<head>`中，或内联必要代码。
* 独立第三方库：使用async（如分析脚本）。

