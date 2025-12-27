---
title: html5有哪些新特性
---

HTML5 是 HTML 标准的重要更新，引入了许多新特性和改进。以下是主要的新特性详解：

## 1. 新的语义化元素

HTML5 引入了多个语义化标签，使页面结构更加清晰：

- `header`: 页面或章节的头部
- `nav`: 导航链接区域
- `main`: 页面主要内容
- `article`: 独立的文章内容
- `section`: 文档中的章节
- `aside`: 侧边栏内容
- footer: 页面或章节的底部

```html
<header>
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">关于</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <section>
      <h2>文章标题</h2>
      <p>文章内容...</p>
    </section>
  </article>
  <aside>
    <h3>侧边栏</h3>
  </aside>
</main>
<footer>
  <p>版权信息</p>
</footer>
```

## 2. 增强的表单元素

HTML5 提供了新的输入类型和属性：

### 新的输入类型：
- `email`: 邮箱输入
- `url`: URL 输入
- `number`: 数字输入
- `range`: 滑动条
- `date`: 日期选择器
- `color`: 颜色选择器
- `search`: 搜索框

### 新的表单属性：
- `placeholder`: 占位符文本
- `required`: 必填字段
- `autofocus`: 自动聚焦
- `autocomplete`: 自动完成

```html
<form>
  <input type="email" placeholder="请输入邮箱" required>
  <input type="number" min="1" max="100" placeholder="输入1-100的数字">
  <input type="date">
  <input type="color">
  <input type="search" placeholder="搜索...">
</form>
```

## 3. 多媒体支持

HTML5 原生支持音频和视频播放：

### 音频支持 (`audio` 元素)：
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频播放。
</audio>
```

### 视频支持 (`video` 元素)：
```html
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  您的浏览器不支持视频播放。
</video>
```

## 4. Canvas 绘图

`canvas` 元素提供了通过 JavaScript 绘制图形的能力：

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 150, 75);
</script>
```

## 5. 地理定位 API

通过 `navigator.geolocation` 可以获取用户地理位置：

```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("纬度: " + position.coords.latitude);
    console.log("经度: " + position.coords.longitude);
  });
}
```

## 6. 本地存储

HTML5 提供了比 Cookie 更强大的存储方式：

### localStorage（持久存储）：
```javascript
// 存储数据
localStorage.setItem('username', 'John');

// 获取数据
const username = localStorage.getItem('username');

// 删除数据
localStorage.removeItem('username');
```

### sessionStorage（会话存储）：
```javascript
// 只在当前会话期间保存
sessionStorage.setItem('tempData', 'temporary');
```

## 7. Web Workers

允许在后台线程中运行 JavaScript，避免阻塞 UI：

```javascript
// 主线程
const worker = new Worker('worker.js');
worker.postMessage('Hello Worker');
worker.onmessage = function(e) {
  console.log('收到Worker消息: ' + e.data);
};

// worker.js 文件
onmessage = function(e) {
  console.log('Worker收到: ' + e.data);
  postMessage('Hello Main Thread');
};
```

## 8. WebSocket

提供全双工通信通道，实现实时数据传输：

```javascript
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('连接已建立');
  socket.send('Hello Server');
};

socket.onmessage = function(event) {
  console.log('收到消息: ' + event.data);
};
```

## 9. 拖放 API

支持元素的拖拽操作：

```html
<div id="draggable" draggable="true">拖拽我</div>
<div id="droppable">放置区域</div>

<script>
document.getElementById('draggable').addEventListener('dragstart', function(e) {
  e.dataTransfer.setData('text/plain', 'Hello Drop');
});

document.getElementById('droppable').addEventListener('dragover', function(e) {
  e.preventDefault();
});

document.getElementById('droppable').addEventListener('drop', function(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  this.innerHTML = data;
});
</script>
```

## 10. 离线应用支持

通过 Application Cache 实现离线访问：

```html
<!DOCTYPE HTML>
<html manifest="cache.manifest">
<!-- 页面内容 -->
</html>
```

```
// cache.manifest 文件
CACHE MANIFEST
#v1.0

CACHE:
index.html
style.css
script.js

NETWORK:
*

FALLBACK:
/ /offline.html
```

## 11. 新的 API 和特性

- **History API**: 操作浏览器历史记录
- **Web Storage**: 更好的本地存储方案
- **Web Sockets**: 实时通信
- **Server-Sent Events**: 服务器推送事件
- **WebRTC**: 实时通信
- **IndexedDB**: 客户端数据库
- **File API**: 文件操作
- **Web Notifications**: 桌面通知

这些新特性使得 HTML5 成为了一个功能强大的平台，能够开发复杂的 Web 应用程序，减少了对插件（如 Flash）的依赖，并提供了更好的用户体验和性能。

