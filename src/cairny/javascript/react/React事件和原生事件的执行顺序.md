---
title: React事件和原生事件的执行顺序
---

## React 事件和原生事件的执行顺序详解

### 1. 基本概念

#### React 事件系统
- **合成事件（SyntheticEvent）**：React 对浏览器原生事件的跨浏览器封装
- **事件委托**：React 将事件处理器统一绑定到 `document` 节点上
- **统一处理**：提供一致的事件接口，屏蔽浏览器差异

#### 原生事件系统
- **DOM 原生事件**：浏览器原生的事件处理机制
- **直接绑定**：事件处理器直接绑定到具体的 DOM 元素上
- **遵循标准**：遵循 W3C 事件规范

### 2. 事件执行顺序示例

#### 基础示例

```jsx
import React, { useEffect } from 'react';

function EventOrderExample() {
  // React 事件处理器
  const handleReactClick = () => {
    console.log('1. React onClick');
  };
  
  useEffect(() => {
    // 原生事件处理器
    const button = document.getElementById('native-button');
    const handleClick = () => {
      console.log('2. Native click listener');
    };
    
    // 原生事件绑定
    button.addEventListener('click', handleClick);
    
    // 清理函数
    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, []);
  
  // 原生事件处理器 - 直接在 DOM 上绑定
  const addNativeListener = () => {
    const button = document.getElementById('direct-button');
    button.onclick = () => {
      console.log('3. Native onclick property');
    };
  };
  
  return (
    <div>
      <h2>React 事件 vs 原生事件执行顺序</h2>
      
      {/* React 事件 */}
      <button onClick={handleReactClick}>
        React Event Button
      </button>
      
      {/* useEffect 中绑定的原生事件 */}
      <button id="native-button">
        Native Event Button (useEffect)
      </button>
      
      {/* 直接绑定的原生事件 */}
      <button 
        id="direct-button" 
        onClick={addNativeListener}
      >
        Native Event Button (Direct)
      </button>
    </div>
  );
}
```

### 3. 详细的执行顺序分析

#### 3.1 捕获阶段 → 目标阶段 → 冒泡阶段

```jsx
function EventPhaseExample() {
  useEffect(() => {
    // 捕获阶段监听器
    document.addEventListener('click', () => {
      console.log('A1. Document capture phase');
    }, true); // true 表示捕获阶段
    
    // 冒泡阶段监听器
    document.addEventListener('click', () => {
      console.log('C1. Document bubble phase');
    }, false);
    
    // 父容器捕获监听器
    const parent = document.getElementById('parent');
    parent.addEventListener('click', () => {
      console.log('A2. Parent capture phase');
    }, true);
    
    // 父容器冒泡监听器
    parent.addEventListener('click', () => {
      console.log('C2. Parent bubble phase');
    }, false);
    
    // 子元素原生监听器
    const child = document.getElementById('child');
    child.addEventListener('click', () => {
      console.log('B1. Child native event');
    });
  }, []);
  
  const handleReactClick = () => {
    console.log('B2. Child React event');
  };
  
  return (
    <div id="parent">
      <button 
        id="child" 
        onClick={handleReactClick}
      >
        Click Me
      </button>
    </div>
  );
}

// 点击按钮后的输出顺序：
// A1. Document capture phase
// A2. Parent capture phase
// B1. Child native event
// B2. Child React event
// C2. Parent bubble phase
// C1. Document bubble phase
```

### 4. React 事件委托机制

#### 4.1 React 事件绑定位置

```jsx
// React 内部实现简化示例
class ReactEventSystem {
  constructor() {
    // React 将所有事件委托到 document
    document.addEventListener('click', this.handleTopLevel);
    document.addEventListener('change', this.handleTopLevel);
    // ... 其他事件
  }
  
  handleTopLevel = (nativeEvent) => {
    // 1. 获取事件目标
    const targetInst = this.getTargetInst(nativeEvent);
    
    // 2. 创建合成事件
    const syntheticEvent = this.createSyntheticEvent(nativeEvent);
    
    // 3. 模拟事件冒泡
    this.dispatchEvent(targetInst, syntheticEvent);
  };
  
  dispatchEvent = (targetInst, syntheticEvent) => {
    // 按照 React 组件树模拟冒泡
    let node = targetInst;
    while (node) {
      this.callCallback(node, syntheticEvent);
      node = node.return; // 移动到父组件
    }
  };
}
```

#### 4.2 实际执行顺序示例

```jsx
function DetailedEventOrder() {
  useEffect(() => {
    // 原生捕获阶段
    document.addEventListener('click', () => {
      console.log('1. Native capture (document)');
    }, true);
    
    // React 事件委托绑定点
    // (React 内部在 document 上绑定事件)
    
    // 原生冒泡阶段
    document.addEventListener('click', () => {
      console.log('5. Native bubble (document)');
    }, false);
  }, []);
  
  const handleParentClick = () => {
    console.log('3. React parent click');
  };
  
  const handleChildClick = () => {
    console.log('2. React child click');
  };
  
  return (
    <div onClick={handleParentClick}>
      <button onClick={handleChildClick}>
        Click Me
      </button>
    </div>
  );
}

// 点击按钮的执行顺序：
// 1. Native capture (document) - 原生捕获
// 2. React child click - React 事件（模拟冒泡开始）
// 3. React parent click - React 事件冒泡
// 4. Native bubble (document) - 原生冒泡
```

### 5. 阻止事件传播的行为差异

#### 5.1 stopPropagation 的不同效果

```jsx
function StopPropagationExample() {
  useEffect(() => {
    const button = document.getElementById('stop-propagation-button');
    
    // 原生事件处理器
    button.addEventListener('click', (e) => {
      console.log('1. Native event handler');
      e.stopPropagation(); // 阻止原生事件冒泡
      // 但这不会阻止 React 事件冒泡！
    });
  }, []);
  
  const handleReactClick = (e) => {
    console.log('2. React event handler');
    // e.stopPropagation(); // 这会阻止 React 事件冒泡
  };
  
  const handleParentClick = () => {
    console.log('3. Parent React event handler');
  };
  
  return (
    <div onClick={handleParentClick}>
      <button 
        id="stop-propagation-button"
        onClick={handleReactClick}
      >
        Stop Propagation Test
      </button>
    </div>
  );
}

// 输出结果：
// 1. Native event handler
// 2. React event handler
// 3. Parent React event handler

// 原生 stopPropagation 不影响 React 事件冒泡
```

#### 5.2 stopImmediatePropagation 的效果

```jsx
function StopImmediatePropagationExample() {
  useEffect(() => {
    const button = document.getElementById('stop-immediate-button');
    
    // 第一个原生事件处理器
    button.addEventListener('click', (e) => {
      console.log('1. First native handler');
      e.stopImmediatePropagation(); // 阻止后续同类型事件处理器
    });
    
    // 第二个原生事件处理器（会被阻止）
    button.addEventListener('click', () => {
      console.log('2. Second native handler'); // 不会执行
    });
  }, []);
  
  const handleReactClick = () => {
    console.log('3. React event handler');
  };
  
  return (
    <button 
      id="stop-immediate-button"
      onClick={handleReactClick}
    >
      Stop Immediate Propagation Test
    </button>
  );
}

// 输出结果：
// 1. First native handler
// 3. React event handler (因为 React 事件绑定在 document 上，不是同元素的多个监听器)
```

### 6. 事件对象的差异

#### 6.1 合成事件 vs 原生事件

```jsx
function EventObjectComparison() {
  const handleReactEvent = (syntheticEvent) => {
    console.log('React SyntheticEvent:', syntheticEvent);
    console.log('Native event:', syntheticEvent.nativeEvent);
    
    // React 合成事件特性
    console.log('Event pooling:', syntheticEvent.isPersistent()); // false
    console.log('Event type:', syntheticEvent.type);
    
    // 需要持久化才能异步访问
    syntheticEvent.persist(); // React 16 中需要，17+ 不再需要
  };
  
  useEffect(() => {
    const button = document.getElementById('native-event-button');
    button.addEventListener('click', (nativeEvent) => {
      console.log('Native Event:', nativeEvent);
      console.log('Event type:', nativeEvent.type);
      console.log('Current target:', nativeEvent.currentTarget);
    });
  }, []);
  
  return (
    <div>
      <button onClick={handleReactEvent}>
        React Event
      </button>
      <button id="native-event-button">
        Native Event
      </button>
    </div>
  );
}
```

### 7. 实际应用场景

#### 7.1 第三方库集成

```jsx
function ThirdPartyIntegration() {
  const buttonRef = useRef();
  
  useEffect(() => {
    // 第三方库可能直接操作 DOM 事件
    const thirdPartyWidget = new ThirdPartyLibrary(buttonRef.current);
    
    // 原生事件监听器
    buttonRef.current.addEventListener('click', (e) => {
      console.log('Third party handler');
      // 可能调用 e.stopPropagation()
    });
    
    return () => {
      thirdPartyWidget.destroy();
    };
  }, []);
  
  const handleReactClick = () => {
    console.log('React handler');
  };
  
  return (
    <button 
      ref={buttonRef}
      onClick={handleReactClick}
    >
      Integrated Button
    </button>
  );
}
```

#### 7.2 事件性能优化

```jsx
function EventPerformanceExample() {
  // 使用 useCallback 优化事件处理器
  const handleClick = useCallback((e) => {
    console.log('Click handled');
  }, []);
  
  useEffect(() => {
    // 批量添加原生事件监听器
    const buttons = document.querySelectorAll('.performance-button');
    const handler = (e) => {
      console.log('Native event handled');
    };
    
    buttons.forEach(button => {
      button.addEventListener('click', handler);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handler);
      });
    };
  }, []);
  
  return (
    <div>
      <button onClick={handleClick} className="performance-button">
        Optimized Button 1
      </button>
      <button onClick={handleClick} className="performance-button">
        Optimized Button 2
      </button>
    </div>
  );
}
```

### 8. 调试技巧

#### 8.1 事件监听器调试

```jsx
function DebugEventOrder() {
  const logEvent = (source, phase) => {
    console.log(`${source} - ${phase}`);
  };
  
  useEffect(() => {
    // 添加调试监听器
    const captureHandler = () => logEvent('Native', 'Capture');
    const bubbleHandler = () => logEvent('Native', 'Bubble');
    
    document.addEventListener('click', captureHandler, true);
    document.addEventListener('click', bubbleHandler, false);
    
    return () => {
      document.removeEventListener('click', captureHandler, true);
      document.removeEventListener('click', bubbleHandler, false);
    };
  }, []);
  
  return (
    <div onClick={() => logEvent('React', 'Bubble')}>
      <button onClick={() => logEvent('React', 'Target')}>
        Debug Events
      </button>
    </div>
  );
}
```

### 9. 总结

**执行顺序规律**：

1. **原生捕获阶段** → **React 事件处理** → **原生冒泡阶段**
2. **React 事件系统独立于原生事件系统**
3. **React 事件冒泡遵循 React 组件树，不是 DOM 树**
4. **stopPropagation 在各自系统内生效**
5. **事件委托使 React 事件绑定在 document 上**

**关键要点**：
- React 事件是合成事件，统一管理
- 原生事件和 React 事件系统相对独立
- 理解执行顺序有助于调试和性能优化
- 合理使用事件 API 避免冲突

这种设计使得 React 能够提供一致的跨浏览器事件体验，同时保持良好的性能。