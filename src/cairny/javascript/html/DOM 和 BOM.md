---
title: DOM 和 BOM
---

## DOM 和 BOM 详解

### DOM (Document Object Model)

DOM（文档对象模型）是 HTML 和 XML 文档的编程接口。它将整个文档作为树形结构来表示，其中每个节点都是一个对象，可以被程序访问和操作。

#### DOM 的特点：
- **结构化表示**：将文档表示为节点树
- **可编程性**：提供 API 供程序访问和修改文档内容
- **平台无关性**：与编程语言无关的标准接口

#### DOM 示例：

```javascript
// 获取元素
const title = document.getElementById('title');
const paragraphs = document.getElementsByTagName('p');

// 修改元素内容
title.textContent = '新的标题';

// 创建新元素
const newDiv = document.createElement('div');
newDiv.textContent = '这是新创建的 div';

// 添加元素到页面
document.body.appendChild(newDiv);

// 事件处理
title.addEventListener('click', function() {
    alert('标题被点击了！');
});
```

### BOM (Browser Object Model)

BOM（浏览器对象模型）是浏览器提供的接口，用于与浏览器窗口进行交互。它包含了多个对象，允许访问浏览器的功能，如导航历史、窗口尺寸、屏幕信息等。

#### BOM 的主要对象：

1. **window**：表示浏览器窗口，是 BOM 的顶层对象
2. **location**：提供当前页面 URL 信息
3. **history**：提供浏览器历史记录操作
4. **navigator**：提供浏览器信息
5. **screen**：提供屏幕相关信息

#### BOM 示例：

```javascript
// window 对象
console.log(window.innerWidth);  // 获取窗口宽度
console.log(window.innerHeight); // 获取窗口高度

// location 对象
console.log(location.href);      // 当前页面 URL
location.assign('https://www.example.com'); // 导航到新页面

// history 对象
history.back();    // 后退
history.forward(); // 前进

// navigator 对象
console.log(navigator.userAgent); // 用户代理字符串
console.log(navigator.language);  // 浏览器语言

// screen 对象
console.log(screen.width);  // 屏幕宽度
console.log(screen.height); // 屏幕高度

// 弹窗功能
alert('这是一个警告框');
const result = confirm('你确定要继续吗？');
const input = prompt('请输入你的名字：');
```

### DOM 与 BOM 的区别

| 特性 | DOM | BOM |
|------|-----|-----|
| **定义** | 文档对象模型，处理 HTML/XML 文档 | 浏览器对象模型，处理浏览器窗口 |
| **作用范围** | 页面内容和结构 | 浏览器功能和窗口操作 |
| **标准化** | W3C 标准 | 没有官方标准，各浏览器实现略有不同 |
| **核心对象** | `document` | `window` |

### 实际应用示例

```javascript
// 结合 DOM 和 BOM 的完整示例
window.addEventListener('load', function() {
    // DOM 操作：修改页面内容
    const header = document.querySelector('h1');
    header.textContent = '欢迎访问 ' + location.hostname;
    
    // BOM 操作：获取浏览器信息
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `
        <p>浏览器窗口尺寸: ${window.innerWidth} x ${window.innerHeight}</p>
        <p>屏幕分辨率: ${screen.width} x ${screen.height}</p>
        <p>当前页面: ${location.href}</p>
    `;
    
    document.body.appendChild(infoDiv);
    
    // 使用 BOM 的定时器功能
    setTimeout(() => {
        alert('页面加载完成！');
    }, 1000);
});
```

### 总结

DOM 和 BOM 是前端开发中两个重要的概念：
- **DOM** 主要用于操作页面内容和结构
- **BOM** 主要用于与浏览器窗口进行交互
- 两者通常结合使用，共同实现丰富的网页交互效果
