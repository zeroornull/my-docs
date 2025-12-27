---
title: react 和 react-dom的关系
---

## React 和 React DOM 的关系详解

### 1. 基本概念

#### React
- **核心库**：React 是一个用于构建用户界面的 JavaScript 库
- **平台无关**：提供核心功能如组件、状态管理、生命周期等
- **虚拟 DOM**：实现虚拟 DOM 和 diff 算法
- **声明式 API**：提供 JSX、Hooks、组件等核心概念

#### React DOM
- **渲染器**：专门负责将 React 组件渲染到浏览器 DOM 中
- **平台特定**：专门针对 Web 浏览器环境
- **DOM 操作**：处理实际的 DOM 更新和操作
- **浏览器 API**：与浏览器 DOM API 交互

### 2. 分层架构关系

```
┌─────────────────────────────────────┐
│           应用层 (App)              │
├─────────────────────────────────────┤
│         React 核心 (React)          │
│  (组件、Hooks、状态、虚拟DOM等)      │
├─────────────────────────────────────┤
│       渲染器层 (Renderers)          │
│  React DOM  │  React Native  │ 其他  │
│ (Web DOM)   │  (原生组件)     │ ...  │
└─────────────────────────────────────┘
```

### 3. 职责分工

#### React 核心职责
```jsx
// React 负责的部分
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('组件更新');
  }, [count]);
  
  // 虚拟 DOM 创建和状态管理
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

#### React DOM 职责
```jsx
// React DOM 负责的部分
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <div>Hello World</div>;
}

// 创建根节点并渲染 - 这是 React DOM 的工作
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 4. 代码示例对比

#### 只使用 React（无法渲染）
```jsx
// 只导入 React - 无法在浏览器中显示
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // 这个组件可以正常工作，但无法渲染到页面
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// 缺少 ReactDOM，无法实际渲染到 DOM
// Counter 组件存在但不会显示在页面上
```

#### 使用 React 和 React DOM（完整示例）
```jsx
// 导入 React 和 React DOM
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// React DOM 负责将组件渲染到实际 DOM 中
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
```

### 5. 其他渲染器对比

#### React DOM (Web)
```jsx
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 特有的 API
ReactDOM.createPortal(<Modal />, document.body);
```

#### React Native (移动端)
```jsx
import { AppRegistry } from 'react-native';

// React Native 渲染器负责渲染到原生组件
AppRegistry.registerComponent('MyApp', () => App);
```

#### React Test Renderer (测试)
```jsx
import TestRenderer from 'react-test-renderer';

// 用于测试的渲染器
const renderer = TestRenderer.create(<App />);
const tree = renderer.toJSON();
```

### 6. 实际应用场景

#### 服务端渲染 (SSR)
```jsx
// 服务端使用 React DOM Server
import ReactDOMServer from 'react-dom/server';

// 服务器端渲染为 HTML 字符串
const html = ReactDOMServer.renderToString(<App />);

// 客户端"水合" (hydrate)
import ReactDOM from 'react-dom/client';
const root = ReactDOM.hydrateRoot(document.getElementById('root'));
root.render(<App />);
```

#### Concurrent Mode 相关
```jsx
// React 18 中的并发特性由 React DOM 实现
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 支持并发渲染
root.render(<App />);

// 特有的 API
root.unstable_scheduleMicrotask(() => {
  // 微任务调度
});
```

### 7. 版本关系

#### 版本同步
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

#### 重要提醒
- React 和 React DOM 版本应该保持一致
- 不同版本间可能存在 API 差异
- React DOM 依赖于特定版本的 React

### 8. 设计哲学

#### 关注点分离
```jsx
// React 关注：组件逻辑、状态管理、虚拟 DOM
function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <li 
          key={todo.id}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          onClick={() => onToggle(todo.id)}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// React DOM 关注：实际 DOM 操作和渲染
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TodoList todos={todos} onToggle={handleToggle} />);
```

### 9. 扩展生态系统

#### 自定义渲染器
```jsx
// 可以创建自定义渲染器
import Reconciler from 'react-reconciler';

const CustomRenderer = Reconciler({
  // 自定义渲染逻辑
  createInstance(type, props) {
    // 创建自定义实例
  },
  
  appendChild(parent, child) {
    // 添加子元素逻辑
  }
  // ... 其他方法
});
```

### 10. 总结

| 特性 | React | React DOM |
|------|-------|-----------|
| 核心功能 | ✓ | |
| 组件系统 | ✓ | |
| 状态管理 | ✓ | |
| 虚拟 DOM | ✓ | |
| 实际渲染 | | ✓ |
| DOM 操作 | | ✓ |
| 浏览器 API | | ✓ |
| 平台无关 | ✓ | |

**简单来说**：React 是"大脑"，负责思考和决策（组件逻辑、状态等）；React DOM 是"手脚"，负责执行具体操作（将虚拟 DOM 渲染为真实 DOM）。这种设计使得 React 可以跨平台使用，只需要更换不同的渲染器即可。