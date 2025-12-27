---
title: fex 布同下，怎么改变元素的顺序
---

## Flexbox 布局下改变元素顺序的方法

在 Flexbox 布局中，有多种方式可以改变元素的显示顺序，而不改变 HTML 结构。

---

### 一、使用 `order` 属性（推荐）

#### 基本语法
```css
.item {
  order: <integer>; /* 默认值为 0 */
}
```

#### 示例
```html
<div class="container">
  <div class="item first">第一个元素</div>
  <div class="item second">第二个元素</div>
  <div class="item third">第三个元素</div>
</div>
```

```css
.container {
  display: flex;
}

.first {
  order: 3; /* 最后显示 */
}

.second {
  order: 1; /* 第二个显示 */
}

.third {
  order: 2; /* 第三个显示 */
}
```

结果顺序：第二个元素 → 第三个元素 → 第一个元素

---

### 二、使用 `flex-direction` 改变主轴方向

#### row-reverse（水平反向）
```css
.container {
  display: flex;
  flex-direction: row-reverse;
}
```

```html
<div class="container">
  <div class="item">元素1</div>
  <div class="item">元素2</div>
  <div class="item">元素3</div>
</div>
```

显示顺序：元素3 → 元素2 → 元素1

#### column-reverse（垂直反向）
```css
.container {
  display: flex;
  flex-direction: column-reverse;
  height: 300px;
}
```

```html
<div class="container">
  <div class="item">元素1</div>
  <div class="item">元素2</div>
  <div class="item">元素3</div>
</div>
```

显示顺序：元素3 → 元素2 → 元素1（从下到上）

---

### 三、使用 `flex-wrap` + `flex-direction` 组合

#### 实现换行后的反向排列
```css
.container {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  width: 200px;
}

.item {
  width: 100px;
  height: 50px;
  background: #f0f0f0;
  margin: 5px;
}
```

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

---

### 四、响应式顺序调整

#### 不同屏幕尺寸下不同的顺序
```css
.container {
  display: flex;
  flex-direction: column;
}

.first {
  order: 1;
}

.second {
  order: 2;
}

.third {
  order: 3;
}

/* 平板及以上尺寸 */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
  
  .first {
    order: 3;
  }
  
  .second {
    order: 1;
  }
  
  .third {
    order: 2;
  }
}

/* 桌面尺寸 */
@media (min-width: 1024px) {
  .first {
    order: 1;
  }
  
  .second {
    order: 2;
  }
  
  .third {
    order: 3;
  }
}
```

---

### 五、实际应用场景

#### 1. 移动端导航栏调整
```html
<header class="header">
  <nav class="nav">导航菜单</nav>
  <div class="logo">Logo</div>
  <div class="user">用户信息</div>
</header>
```

```css
.header {
  display: flex;
  align-items: center;
  padding: 10px;
}

.logo {
  order: -1; /* 移动端优先显示 Logo */
  flex: 1;
  text-align: center;
}

.nav {
  order: -2; /* 菜单放在最前面 */
}

.user {
  order: -1;
}

/* 桌面端 */
@media (min-width: 768px) {
  .logo {
    order: 0; /* 恢复正常顺序 */
    flex: 0 0 150px;
  }
  
  .nav {
    order: 0;
    flex: 1;
  }
  
  .user {
    order: 0;
    flex: 0 0 100px;
  }
}
```

#### 2. 内容区域重新排序
```html
<div class="content-layout">
  <aside class="sidebar">侧边栏</aside>
  <main class="main-content">主要内容</main>
  <div class="advertisement">广告</div>
</div>
```

```css
.content-layout {
  display: flex;
  flex-direction: column;
}

.sidebar {
  order: 2;
}

.main-content {
  order: 1;
}

.advertisement {
  order: 3;
}

/* 桌面端 */
@media (min-width: 1024px) {
  .content-layout {
    flex-direction: row;
  }
  
  .sidebar {
    order: 1;
    flex: 0 0 250px;
  }
  
  .main-content {
    order: 2;
    flex: 1;
  }
  
  .advertisement {
    order: 3;
    flex: 0 0 200px;
  }
}
```

#### 3. 卡片列表排序
```html
<div class="card-container">
  <div class="card featured">特色卡片</div>
  <div class="card">普通卡片1</div>
  <div class="card">普通卡片2</div>
  <div class="card important">重要卡片</div>
</div>
```

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.featured {
  order: -1;
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.important {
  order: -2;
  background: #ffebee;
  border: 2px solid #f44336;
}
```

---

### 六、order 属性详解

#### 1. 数值范围
```css
.item1 { order: -10; }  /* 很靠前 */
.item2 { order: -1; }   /* 靠前 */
.item3 { order: 0; }    /* 默认顺序 */
.item4 { order: 1; }    /* 靠后 */
.item5 { order: 10; }   /* 很靠后 */
```

#### 2. 相同 order 值的处理
```css
.container {
  display: flex;
}

.item1 { order: 1; }
.item2 { order: 1; } /* 与 item1 相同 */
.item3 { order: 2; }

/* 结果：item1 和 item2 按照 HTML 顺序排列，然后是 item3 */
```

#### 3. 动态调整顺序（JavaScript）
```javascript
const items = document.querySelectorAll('.item');
const container = document.querySelector('.container');

function reorderItems() {
  items.forEach((item, index) => {
    item.style.order = items.length - index; // 反向排序
  });
}

// 点击按钮重新排序
document.querySelector('.reorder-btn').addEventListener('click', reorderItems);
```

---

### 七、注意事项

1. **order 只影响视觉顺序**，不影响键盘导航和屏幕阅读器顺序
2. **语义化考虑**：改变视觉顺序时要考虑可访问性
3. **性能**：频繁改变 order 可能影响渲染性能
4. **兼容性**：order 属性在 IE10+ 和现代浏览器中支持良好

---

### 八、总结

在 Flexbox 布局中，改变元素顺序最常用和推荐的方法是使用 `order` 属性，它提供了精确的控制能力。配合媒体查询，可以实现响应式的顺序调整，满足不同设备的布局需求。对于简单的整体反向排列，可以使用 `flex-direction: row-reverse` 或 `column-reverse`。

这些技术在现代 Web 开发中非常实用，特别是在移动端优先的设计中，可以灵活调整布局顺序以适应不同的屏幕尺寸。