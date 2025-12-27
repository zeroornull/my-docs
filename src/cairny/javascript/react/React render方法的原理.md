---
title: React render方法的原理
---

## React render 方法原理详解

### 1. render 方法的基本概念

React 的 `render` 方法是 React 组件的核心，它负责描述 UI 应该是什么样子。在 React 18 中，主要有两种 render 方法：

```jsx
// React 18 之前的 render 方法
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18 的新 render 方法
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. render 方法的工作原理

#### 2.1 虚拟 DOM 创建过程

```jsx
// 当调用 render 时发生的过程
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="app">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

// 1. JSX 被转换为 React.createElement 调用
const element = React.createElement(
  'div',
  { className: 'app' },
  React.createElement('h1', null, 'Count: ', count),
  React.createElement(
    'button',
    { onClick: () => setCount(c => c + 1) },
    'Increment'
  )
);

// 2. 创建虚拟 DOM 树
const virtualDOM = {
  type: 'div',
  props: {
    className: 'app',
    children: [
      {
        type: 'h1',
        props: {
          children: ['Count: ', 0]
        }
      },
      {
        type: 'button',
        props: {
          onClick: () => setCount(c => c + 1),
          children: ['Increment']
        }
      }
    ]
  }
};
```

#### 2.2 协调（Reconciliation）过程

```jsx
// 简化的协调过程
function reconcile(parentDom, virtualDOM, oldVirtualDOM) {
  // 1. 比较新旧虚拟 DOM
  if (virtualDOM.type !== oldVirtualDOM?.type) {
    // 类型不同，替换整个节点
    replaceNode(parentDom, virtualDOM);
  } else {
    // 类型相同，更新属性和子节点
    updateNode(parentDom, virtualDOM, oldVirtualDOM);
  }
}

// 2. 更新实际 DOM
function updateNode(domNode, newVNode, oldVNode) {
  // 更新属性
  updateAttributes(domNode, newVNode.props, oldVNode.props);
  
  // 协调子节点
  reconcileChildren(domNode, newVNode.props.children, oldVNode.props.children);
}
```

### 3. render 方法触发时机

#### 3.1 初始渲染

```jsx
// 应用首次加载时触发
import ReactDOM from 'react-dom/client';

function App() {
  return <div>Hello World</div>;
}

// 首次渲染触发
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // 触发完整的初始渲染
```

#### 3.2 状态更新触发重新渲染

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // 每次调用 setCount 都会触发重新渲染
  const handleClick = () => {
    setCount(count + 1); // 触发重新渲染
  };
  
  console.log('Counter rendering'); // 每次渲染都会打印
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

#### 3.3 Props 变化触发重新渲染

```jsx
function Parent() {
  const [message, setMessage] = useState('Hello');
  
  return (
    <div>
      <button onClick={() => setMessage('Hello World')}>
        Update Message
      </button>
      <Child message={message} /> {/* Props 变化触发 Child 重新渲染 */}
    </div>
  );
}

function Child({ message }) {
  console.log('Child rendering with:', message);
  
  return <div>{message}</div>;
}
```

#### 3.4 Context 变化触发重新渲染

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
        <Toolbar /> {/* Context 变化触发 Toolbar 及其子组件重新渲染 */}
      </div>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  
  console.log('Toolbar rendering with theme:', theme);
  
  return (
    <div className={`toolbar toolbar-${theme}`}>
      <ThemedButton />
    </div>
  );
}
```

### 4. React 18 的并发渲染特性

#### 4.1 自动批处理（Automatic Batching）

```jsx
function Button() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  const handleClick = () => {
    // React 18 会自动批处理这些更新
    setCount(c => c + 1);
    setFlag(f => !f);
    setCount(c => c + 1);
    // 只会触发一次重新渲染
  };
  
  console.log('Button rendering'); // 只打印一次
  
  return (
    <button onClick={handleClick}>
      Count: {count}, Flag: {String(flag)}
    </button>
  );
}
```

#### 4.2 并发特性

```jsx
function App() {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // 低优先级更新
    startTransition(() => {
      // 这个更新不会阻塞用户输入
      search(e.target.value).then(setData);
    });
  };
  
  return (
    <div>
      <input value={text} onChange={handleTextChange} />
      {isPending ? <Spinner /> : <List data={data} />}
    </div>
  );
}
```

### 5. 渲染阶段详解

#### 5.1 Render 阶段

```jsx
// Render 阶段：纯函数计算，可以中断
function performUnitOfWork(fiber) {
  // 1. beginWork - 处理当前 Fiber 节点
  const next = beginWork(current, workInProgress, renderExpirationTime);
  
  // 2. 如果有子节点，返回子节点继续处理
  if (next) {
    return next;
  }
  
  // 3. completeWork - 完成当前 Fiber 节点
  completeUnitOfWork(workInProgress);
  
  // 4. 返回兄弟节点或父节点
  return sibling || returnFiber;
}
```

#### 5.2 Commit 阶段

```jsx
// Commit 阶段：实际 DOM 操作，不能中断
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  
  // 1. before mutation 阶段
  commitBeforeMutationEffects(root, finishedWork);
  
  // 2. mutation 阶段 - 实际 DOM 更新
  commitMutationEffects(root, renderPriorityLevel);
  
  // 3. layout 阶段 - 调用生命周期方法
  commitLayoutEffects(finishedWork, root, lanes);
}
```

### 6. 性能优化相关

#### 6.1 避免不必要的重新渲染

```jsx
// 使用 React.memo 优化函数组件
const ExpensiveComponent = React.memo(({ data, onChange }) => {
  console.log('ExpensiveComponent rendering');
  
  // 昂贵的计算
  const expensiveValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={onChange}>Change</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data === nextProps.data;
});
```

#### 6.2 使用 useCallback 优化回调函数

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // 使用 useCallback 避免子组件不必要的重新渲染
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <Child onClick={handleClick} />
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendering');
  return <button onClick={onClick}>Click me</button>;
});
```

### 7. 错误边界与渲染错误处理

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('Rendering error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // 自定义降级 UI
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// 使用错误边界
function App() {
  return (
    <ErrorBoundary>
      <MyWidget />
    </ErrorBoundary>
  );
}
```

### 8. 服务端渲染中的 render

```jsx
// 服务端渲染
import ReactDOMServer from 'react-dom/server';

// 同步渲染为 HTML 字符串
const html = ReactDOMServer.renderToString(<App />);

// 流式渲染（React 18）
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    // 首屏内容准备就绪
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    pipe(res);
  },
  onError(error) {
    res.statusCode = 500;
    console.error(error);
  }
});
```

### 9. 触发 render 的完整流程

```jsx
// 1. 状态更新
setState(newValue);

// 2. 调度更新
scheduleUpdateOnFiber(fiber, lane, eventTime);

// 3. 准备工作循环
ensureRootIsScheduled(root, eventTime);

// 4. 执行协调
performSyncWorkOnRoot(root); // 同步更新
// 或
performConcurrentWorkOnRoot(root); // 并发更新

// 5. Render 阶段
beginWork(current, workInProgress, renderExpirationTime);

// 6. Commit 阶段
commitRoot(root);

// 7. 实际 DOM 更新
updateDOMProperties(domElement, newProps, oldProps);
```

### 10. 总结

React render 方法的核心特点：

1. **声明式渲染**：描述 UI 应该是什么样子
2. **虚拟 DOM**：提高渲染性能
3. **协调算法**：智能更新 DOM
4. **触发时机**：状态变化、Props 变化、Context 变化等
5. **并发特性**：React 18 支持可中断的渲染
6. **批处理**：优化多次状态更新
7. **错误处理**：错误边界捕获渲染错误

render 方法是 React 的核心，理解其原理有助于编写高性能的 React 应用。