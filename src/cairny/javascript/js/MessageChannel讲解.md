---
title: MessageChannel讲解
---


##### MessageChannel 概述
MessageChannel 是 Web API 提供的一种通信机制，允许在不同浏览上下文（如窗口、iframe、worker 或 service worker）之间进行直接的双向通信。


##### 基本结构
```javascript
// 一个 MessageChannel 由两个相互连接的 MessagePort 组成：

const channel = new MessageChannel();
console.log(channel.port1); // 第一个 MessagePort
console.log(channel.port2); // 第二个 MessagePort
```

##### 主要使用场景
1. iframe 与父窗口通信
```javascript
// 父窗口
const iframe = document.querySelector('iframe');
const channel = new MessageChannel();

iframe.contentWindow.postMessage('init', '*', [channel.port2]);
channel.port1.onmessage = (e) => {
  console.log('来自 iframe 的消息:', e.data);
};

// iframe 内部
window.onmessage = (e) => {
  const port = e.ports[0];
  port.postMessage('iframe 已连接');
};
```

2. Web Worker 通信
```javascript
// 主线程
const worker = new Worker('worker.js');
const channel = new MessageChannel();

worker.postMessage('port', [channel.port2]);
channel.port1.onmessage = (e) => {
  console.log('来自 worker 的消息:', e.data);
};

// worker.js
onmessage = (e) => {
  if (e.data === 'port') {
    const port = e.ports[0];
    port.postMessage('worker 已连接');
  }
};
```

3. Service Worker 与页面通信
```javascript
// 页面
navigator.serviceWorker.controller.postMessage('init', [channel.port2]);

// Service Worker
self.onmessage = (e) => {
  if (e.data === 'init') {
    const port = e.ports[0];
    port.postMessage('SW 已连接');
  }
};
```

4. 不同标签页间通信（通过 SharedWorker）
5. React 等框架内部通信（React 使用 MessageChannel 实现调度器）

##### 优势
**直接通信：** 相比 postMessage 更直接的通信方式

**双向通道：** 两个端口可以独立通信

**性能更好：** 对于高频通信场景比普通的 postMessage 更高效

**更安全：** 可以精确控制通信端口的分发

:::warning
需要手动管理端口的开启和关闭

注意避免内存泄漏，不使用时关闭端口

部分旧浏览器可能不支持
:::

