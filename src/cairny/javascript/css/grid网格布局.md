---
title: grid网格布局
---

## CSS Grid 网格布局详解

CSS Grid Layout（网格布局）是 CSS 中最强大的布局系统之一，它是一个二维布局系统，可以同时控制行和列，适用于创建复杂的网页布局。

### 核心概念

1. **Grid Container（网格容器）**：应用 `display: grid` 的元素
2. **Grid Item（网格项目）**：网格容器的直接子元素
3. **Grid Line（网格线）**：构成网格结构的分界线
4. **Grid Track（网格轨道）**：两条相邻网格线之间的空间（行或列）
5. **Grid Cell（网格单元）**：四个网格线包围的最小区域
6. **Grid Area（网格区域）**：由多个网格单元组成的矩形区域

### 基本属性

#### 容器属性

- `display: grid | inline-grid`：定义网格容器
- `grid-template-columns` 和 `grid-template-rows`：定义行和列的大小
- `grid-gap`（或 `gap`）：定义网格线之间的间距
- `justify-items` 和 `align-items`：控制网格项目在单元格内的对齐方式
- `justify-content` 和 `align-content`：控制整个网格在容器中的对齐方式

#### 项目属性

- `grid-column-start` 和 `grid-column-end`：定义项目占据的列起始和结束位置
- `grid-row-start` 和 `grid-row-end`：定义项目占据的行起始和结束位置
- `grid-column` 和 `grid-row`：简写属性
- `grid-area`：一次性定义行和列的起始/结束位置
- `justify-self` 和 `align-self`：单独控制某个项目在单元格内的对齐方式

### 实际示例

#### 1. 基础网格布局

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列，每列等宽 */
  grid-template-rows: repeat(2, 100px);  /* 2行，每行100px */
  gap: 10px; /* 网格间距 */
}

.item {
  background-color: lightblue;
  padding: 20px;
  text-align: center;
}
```

#### 2. 不规则网格区域

```html
<div class="layout">
  <header class="header">Header</header>
  <nav class="nav">Navigation</nav>
  <main class="main">Main Content</main>
  <aside class="sidebar">Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header header"
    "nav main sidebar"
    "footer footer footer";
  height: 100vh;
  gap: 10px;
}

.header {
  grid-area: header;
  background-color: #f0f0f0;
  padding: 20px;
}

.nav {
  grid-area: nav;
  background-color: #e0e0e0;
  padding: 20px;
}

.main {
  grid-area: main;
  background-color: #fff;
  padding: 20px;
}

.sidebar {
  grid-area: sidebar;
  background-color: #e0e0e0;
  padding: 20px;
}

.footer {
  grid-area: footer;
  background-color: #f0f0f0;
  padding: 20px;
}
```

#### 3. 响应式网格布局

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
}
```

这个布局会根据容器宽度自动调整列数，每列最小宽度为250px，最大为1fr。

#### 4. 复杂网格项目定位

```html
<div class="complex-grid">
  <div class="item-a">A</div>
  <div class="item-b">B</div>
  <div class="item-c">C</div>
  <div class="item-d">D</div>
</div>
```

```css
.complex-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
  height: 400px;
}

.item-a {
  grid-column: 1 / 3; /* 占据第1到第3列 */
  grid-row: 1 / 2;     /* 占据第1到第2行 */
  background-color: coral;
}

.item-b {
  grid-column: 3 / 5;  /* 占据第3到第5列 */
  grid-row: 1 / 3;     /* 占据第1到第3行 */
  background-color: lightgreen;
}

.item-c {
  grid-column: 1 / 2;  /* 占据第1到第2列 */
  grid-row: 2 / 4;     /* 占据第2到第4行 */
  background-color: lightblue;
}

.item-d {
  grid-column: 2 / 3;  /* 占据第2到第3列 */
  grid-row: 3 / 4;     /* 占据第3到第4行 */
  background-color: lightyellow;
}
```

### Grid 的优势

1. **二维布局控制**：同时控制行和列，比 Flexbox 更适合复杂布局
2. **灵活的对齐方式**：提供多种对齐选项
3. **响应式友好**：配合 `auto-fit`、`minmax()` 等函数实现响应式设计
4. **直观的项目定位**：可以精确控制项目在网格中的位置
5. **重叠布局支持**：允许项目重叠，提供更多设计可能性

Grid 布局特别适用于页面整体布局、卡片式布局、表单布局等场景，是现代 Web 开发中不可或缺的布局工具。