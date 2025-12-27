---
title: jquery的ready和windowd的load有什么区别
---

jQuery的`ready`和window的`load`事件是JavaScript中两个重要的页面加载事件，它们有以下主要区别：

## 1. 触发时机不同

- **`$(document).ready()`**：当DOM结构加载完成时触发，不等待样式表、图像和子框架加载完成
- **`window.onload`**：当页面所有资源（包括图片、样式表、脚本等）完全加载完成后才触发

## 2. 执行速度

```javascript
// jQuery ready - 执行较快
$(document).ready(function() {
    // DOM加载完成后立即执行
    console.log("DOM ready executed");
});

// window load - 执行较慢
window.onload = function() {
    // 所有资源加载完成后执行
    console.log("Window load executed");
};
```

## 3. 多次绑定行为

- **`$(document).ready()`**：支持多次绑定，可以绑定多个处理函数
- **`window.onload`**：只能绑定一个处理函数，后续绑定会覆盖之前的

```javascript
// jQuery ready可以多次绑定
$(document).ready(function() {
    console.log("First ready handler");
});

$(document).ready(function() {
    console.log("Second ready handler");
});

// window.onload会被覆盖
window.onload = function() {
    console.log("First onload handler");
};

window.onload = function() {
    console.log("Second onload handler"); // 只有这个会执行
};
```

## 4. 浏览器兼容性

- **`$(document).ready()`**：jQuery封装，提供良好的跨浏览器兼容性
- **`window.onload`**：原生JavaScript，各浏览器实现基本一致，但在某些情况下可能有细微差别

## 5. 使用场景

### 适合使用`$(document).ready()`的场景：
- 操作DOM元素
- 绑定事件处理器
- 初始化插件

### 适合使用`window.onload`的场景：
- 需要获取图片的尺寸
- 操作依赖于完整资源加载的功能
- 需要确保所有外部资源都已加载完毕

## 6. 现代替代方案

现代开发中，也可以使用原生的替代方案：

```javascript
// 等价于 $(document).ready()
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");
});

// 等价于 window.onload
window.addEventListener('load', function() {
    console.log("All resources loaded");
});
```

总的来说，`$(document).ready()`更适合大多数DOM操作场景，因为它执行更快，而`window.onload`适用于需要等待所有资源加载完成的特殊情况。