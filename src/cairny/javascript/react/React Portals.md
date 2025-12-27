---
title: React Portals
---

## React Portals 的用途详解

### 1. 什么是 React Portals

`React Portals` 是 React 提供的一种机制，允许将子组件渲染到 DOM 树中不同的位置，而不是按照默认的父子组件层级关系渲染。它提供了一种"传送"组件到 DOM 树中任意位置的能力。

### 2. Portals 的主要用途

#### 2.1 模态框/对话框 (Modals/Dialogs)

最常见的用途是创建模态框，避免样式和 z-index 问题：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.body // 渲染到 body 下，避免被父元素样式限制
  );
}

// 使用示例
function App() {
  const [showModal, setShowModal] = React.useState(false);
  
  return (
    <div className="app">
      <h1>主应用内容</h1>
      <button onClick={() => setShowModal(true)}>
        打开模态框
      </button>
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
      >
        <h2>模态框标题</h2>
        <p>这是模态框的内容</p>
      </Modal>
    </div>
  );
}
```

#### 2.2 工具提示和弹出框 (Tooltips/Popovers)

```jsx
function Tooltip({ children, content, visible }) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef();
  
  React.useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.bottom + 5
      });
    }
  }, [visible]);
  
  if (!visible) {
    return <span ref={triggerRef}>{children}</span>;
  }
  
  return (
    <>
      <span ref={triggerRef}>{children}</span>
      {ReactDOM.createPortal(
        <div 
          className="tooltip"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

// 使用示例
function App() {
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  return (
    <div>
      <Tooltip 
        content="这是一个有用的提示信息"
        visible={showTooltip}
      >
        <button 
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          悬停显示提示
        </button>
      </Tooltip>
    </div>
  );
}
```

#### 2.3 下拉菜单 (Dropdowns)

```jsx
function Dropdown({ options, onSelect, children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef();
  
  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.bottom
      });
    }
    setIsOpen(!isOpen);
  };
  
  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };
  
  return (
    <div className="dropdown">
      <div ref={triggerRef} onClick={toggleDropdown}>
        {children}
      </div>
      
      {isOpen && ReactDOM.createPortal(
        <div 
          className="dropdown-menu"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000
          }}
        >
          {options.map(option => (
            <div 
              key={option.value}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
```

#### 2.4 全局通知 (Notifications/Toasts)

```jsx
const NotificationContainer = () => {
  const [notifications, setNotifications] = React.useState([]);
  
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // 自动移除
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return ReactDOM.createPortal(
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>,
    document.getElementById('notification-root') || document.body
  );
};

// 全局通知管理器
const notificationManager = {
  show: (options) => {
    // 这里可以通过 Context 或其他方式调用
  }
};
```

### 3. 解决的关键问题

#### 3.1 CSS 样式隔离问题
```jsx
// 不使用 Portal 时可能出现的问题
<div className="parent" style={{ overflow: 'hidden', position: 'relative' }}>
  <div className="modal"> {/* 这个模态框会被裁剪或定位受限 */}
    Modal Content
  </div>
</div>

// 使用 Portal 解决问题
return ReactDOM.createPortal(
  <div className="modal"> {/* 渲染到 body，不受父元素样式影响 */}
    Modal Content
  </div>,
  document.body
);
```

#### 3.2 z-index 层级问题
```jsx
// 传统方式可能遇到 z-index stacking context 问题
<div style={{ zIndex: 1 }}>
  <div style={{ zIndex: 9999 }}> {/* 仍然可能被更高层级的祖先元素遮挡 */}
    Modal Content
  </div>
</div>

// Portal 方式直接挂载到 body，避免 stacking context 问题
ReactDOM.createPortal(
  <div style={{ zIndex: 9999 }}> {/* 直接相对于 body 定位 */}
    Modal Content
  </div>,
  document.body
);
```

### 4. 特殊用途场景

#### 4.1 与第三方库集成
```jsx
function ThirdPartyWidget({ widgetId }) {
  const containerRef = React.useRef();
  
  React.useEffect(() => {
    if (containerRef.current) {
      // 初始化第三方库到指定容器
      const widget = new ThirdPartyLibrary.Widget(widgetId);
      widget.mount(containerRef.current);
      
      return () => widget.destroy();
    }
  }, [widgetId]);
  
  return ReactDOM.createPortal(
    <div ref={containerRef} className="third-party-container" />,
    document.getElementById('widgets-container') || document.body
  );
}
```

#### 4.2 性能优化场景
```jsx
// 将频繁更新的组件渲染到独立的 DOM 节点，避免影响主应用
function PerformanceCriticalComponent({ data }) {
  return ReactDOM.createPortal(
    <div className="performance-container">
      {data.map(item => (
        <ExpensiveComponent key={item.id} item={item} />
      ))}
    </div>,
    document.getElementById('performance-root') || document.body
  );
}
```

### 5. Portals 的优势

1. **突破 DOM 层级限制**：可以在任意 DOM 位置渲染内容
2. **保持 React 组件树结构**：事件冒泡和上下文仍然遵循 React 组件结构
3. **解决样式冲突问题**：避免被父元素样式影响
4. **提高组件复用性**：模态框等组件可以独立于使用位置
5. **更好的可访问性支持**：可以更容易地管理焦点和键盘导航

### 6. 使用注意事项

1. **确保目标 DOM 元素存在**：Portal 需要挂载到已存在的 DOM 元素
2. **事件处理**：虽然渲染位置改变，但事件冒泡仍遵循 React 组件树
3. **服务端渲染**：需要特殊处理，因为服务端没有 DOM
4. **清理工作**：组件卸载时 Portal 内容会自动清理
5. **样式管理**：可能需要额外的 CSS 来处理样式隔离

React Portals 是一个强大的特性，它使得我们可以创建更加灵活和强大的 UI 组件，特别适用于需要突破当前 DOM 层级结构的场景。