---
title: React 需要 fiber 架构，而 Vue 却不需要
---

## React Fiber 架构与 Vue 的对比分析

### 1. 什么是 React Fiber

React Fiber 是 React 16 引入的全新协调（reconciliation）引擎，它重新实现了 React 的核心算法：

```jsx
// React 15 之前的 Stack Reconciler（递归调用栈）
function performWork() {
  // 递归遍历整个组件树
  // 一旦开始就无法中断
  renderComponentTree(rootComponent);
}

// React Fiber 的可中断协调
function workLoop(deadline) {
  // 可以在任意时间点暂停和恢复
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  
  if (nextUnitOfWork) {
    // 时间不够，下次继续
    scheduleCallback(workLoop);
  }
}
```

### 2. React 需要 Fiber 的原因

#### 2.1 同步渲染的阻塞问题

```jsx
// React 15 的同步渲染问题
class LargeList extends React.Component {
  render() {
    return (
      <div>
        {Array.from({ length: 10000 }, (_, i) => (
          <Item key={i} value={i} />
        ))}
      </div>
    );
  }
}

// 问题：渲染这个大列表会阻塞主线程
// 用户界面会卡顿，无法响应交互
```

#### 2.2 缺乏优先级调度

```jsx
// React 15 无法区分任务优先级
function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  
  // 用户点击按钮（高优先级）
  const handleUserClick = () => setCount(c => c + 1);
  
  // 数据加载（低优先级）
  useEffect(() => {
    fetchData().then(setData); // 可能阻塞用户交互
  }, []);
  
  return (
    <div>
      <button onClick={handleUserClick}>Count: {count}</button>
      <List data={data} /> {/* 大量数据渲染 */}
    </div>
  );
}
```

### 3. Vue 为什么不需要 Fiber

#### 3.1 响应式系统的不同

```javascript
// Vue 3 的响应式系统
import { reactive, effect } from 'vue';

// Vue 的响应式是细粒度的
const state = reactive({
  count: 0,
  list: []
});

// 只更新依赖变化的部分
effect(() => {
  // 当 state.count 变化时，只更新相关部分
  console.log('Count changed:', state.count);
});

// 不需要重新遍历整个组件树
```

#### 3.2 编译时优化

```vue
<!-- Vue 模板编译优化示例 -->
<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<!-- 编译后会生成优化的渲染函数 -->
<script>
// Vue 编译器会生成类似这样的优化代码
function render(_ctx) {
  return {
    tag: 'div',
    children: [
      {
        tag: 'h1',
        dynamic: true, // 标记动态内容
        value: () => _ctx.title
      },
      {
        tag: 'ul',
        children: _ctx.list.map(item => ({
          tag: 'li',
          key: item.id,
          dynamic: false, // 静态内容
          value: item.name
        }))
      }
    ]
  };
}
</script>
```

### 4. 架构设计差异对比

#### 4.1 React 的设计哲学

```jsx
// React 的声明式更新
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  // 每次状态变化，重新渲染整个组件树
  return (
    <div>
      <TodoList todos={todos} />
      <TodoForm onSubmit={addTodo} />
    </div>
  );
  
  function addTodo(text) {
    // 触发完整的重新渲染过程
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }
}
```

#### 4.2 Vue 的设计哲学

```vue
<!-- Vue 的响应式更新 -->
<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input v-model="todo.done" type="checkbox">
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [
        { id: 1, text: 'Learn Vue', done: false },
        { id: 2, text: 'Build app', done: false }
      ]
    };
  },
  methods: {
    addTodo(text) {
      // 直接修改数据，Vue 自动追踪依赖
      this.todos.push({ id: Date.now(), text, done: false });
      // 只更新相关的 DOM 节点
    }
  }
};
</script>
```

### 5. 具体实现差异

#### 5.1 React Fiber 的工作单元

```javascript
// Fiber 节点结构
const fiber = {
  tag: 'FunctionComponent', // 组件类型
  type: MyComponent,        // 组件构造函数
  stateNode: null,          // 实例或 DOM 节点
  return: parentFiber,      // 父 Fiber
  child: childFiber,        // 第一个子 Fiber
  sibling: siblingFiber,    // 兄弟 Fiber
  pendingProps: props,      // 新的 props
  memoizedProps: oldProps,  // 旧的 props
  pendingWorkPriority: 0,   // 工作优先级
};

// 可中断的工作流程
function performUnitOfWork(fiber) {
  // 1. 执行当前工作单元
  beginWork(fiber);
  
  // 2. 如果有子节点，返回子节点
  if (fiber.child) {
    return fiber.child;
  }
  
  // 3. 否则处理兄弟节点或返回父节点
  let nextFiber = fiber;
  while (nextFiber) {
    completeWork(nextFiber);
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
  
  return null;
}
```

#### 5.2 Vue 的响应式依赖追踪

```javascript
// Vue 3 的响应式系统简化示例
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = [];
  }
  
  run() {
    activeEffect = this;
    try {
      return this.fn();
    } finally {
      activeEffect = undefined;
    }
  }
  
  stop() {
    for (let i = 0; i < this.deps.length; i++) {
      this.deps[i].delete(this);
    }
    this.deps.length = 0;
  }
}

// 依赖收集
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (dep) {
    const effects = [...dep];
    for (const effect of effects) {
      effect.run(); // 直接触发相关副作用
    }
  }
}
```

### 6. 性能和用户体验对比

#### 6.1 React Fiber 的时间切片

```jsx
// React 18 的并发特性
import { useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState('');
  
  const handleChange = (e) => {
    setText(e.target.value);
    
    // 低优先级的更新，不会阻塞用户输入
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };
  
  return (
    <div>
      <input value={text} onChange={handleChange} />
      {isPending ? <Spinner /> : <SearchResults query={searchQuery} />}
    </div>
  );
}
```

#### 6.2 Vue 的异步更新队列

```vue
<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      // Vue 会将这些更新放入队列，异步批量处理
      this.count++;
      this.count++;
      this.count++;
      
      // 此时 DOM 还未更新
      console.log(this.$el.textContent); // 可能还是旧值
      
      // 下一个 tick 才会更新
      this.$nextTick(() => {
        console.log(this.$el.textContent); // 新值
      });
    }
  }
};
</script>
```

### 7. 总结

| 特性 | React Fiber | Vue 响应式 |
|------|-------------|------------|
| **更新机制** | 完整虚拟 DOM diff | 细粒度依赖追踪 |
| **可中断性** | ✅ 可中断协调 | ❌ 同步更新 |
| **优先级调度** | ✅ 多优先级 | ⚠️ 异步批量 |
| **编译优化** | ❌ 运行时 | ✅ 编译时优化 |
| **学习成本** | 较高 | 相对较低 |
| **调试复杂度** | 较高 | 相对简单 |

**核心区别**：
1. **React** 采用"推"的方式，每次状态变化重新渲染整个组件树，需要 Fiber 来管理复杂的协调过程
2. **Vue** 采用"拉"的方式，通过响应式系统精确追踪依赖，只更新必要的部分，不需要复杂的调度机制

这就是为什么 React 需要 Fiber 架构而 Vue 不需要的根本原因 - 它们采用了完全不同的更新和渲染策略。