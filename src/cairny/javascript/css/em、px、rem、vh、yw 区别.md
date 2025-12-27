---
title: em/px/rem/vh/yw 区别
---

## CSS 单位详解：em/px/rem/vh/vw 的区别

### 1. 基本分类

CSS单位主要分为两类：
- **绝对单位**：固定值，不随环境变化
- **相对单位**：相对于某个基准值，会根据环境变化

### 2. 各单位详细说明

#### px (像素) - 绝对单位
- 最常用的单位，表示屏幕上的一个物理像素点
- 固定大小，不会随其他元素变化
- 精确控制，易于理解和使用

```css
.example {
  font-size: 16px;
  width: 200px;
  height: 100px;
  margin: 10px;
}
```

#### em - 相对于字体大小的单位
- 相对于**当前元素的字体大小** (font-size)
- 1em = 当前元素的font-size值
- 如果没有设置font-size，则继承父元素的font-size

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px * 1.5 = 24px */
  margin: 2em;       /* 24px * 2 = 48px (基于自身的font-size) */
  padding: 1em;      /* 24px * 1 = 24px */
}
```

#### rem - 相对于根元素的字体大小
- 相对于 `<html>` 元素的字体大小
- 1rem = html元素的font-size值
- 避免了em的嵌套计算问题

```css
html {
  font-size: 16px; /* 基准值 */
}

.header {
  font-size: 1.5rem; /* 16px * 1.5 = 24px */
  margin: 2rem;       /* 16px * 2 = 32px */
}

.content {
  font-size: 1rem;   /* 16px * 1 = 16px */
  padding: 1.5rem;   /* 16px * 1.5 = 24px */
}
```

#### vh (视口高度) 和 vw (视口宽度)
- **vh**: 相对于视口高度的1%
- **vw**: 相对于视口宽度的1%
- 视口 = 浏览器窗口的可见区域

```css
.fullscreen {
  width: 100vw;   /* 等于视口宽度的100% */
  height: 100vh;  /* 等于视口高度的100% */
}

.half-width {
  width: 50vw;    /* 视口宽度的一半 */
}

.quarter-height {
  height: 25vh;   /* 视口高度的四分之一 */
}
```

### 3. 实际应用示例

```html
<!DOCTYPE html>
<html lang="zh">
<head>
<style>
  html {
    font-size: 16px; /* rem的基准值 */
  }
  
  .container {
    font-size: 20px;
  }
  
  .px-example {
    font-size: 18px;
    width: 200px;
    height: 100px;
    background-color: lightblue;
    margin: 10px;
  }
  
  .em-example {
    font-size: 1.2em; /* 基于父元素字体大小: 20px * 1.2 = 24px */
    width: 10em;       /* 24px * 10 = 240px */
    height: 5em;       /* 24px * 5 = 120px */
    background-color: lightcoral;
    margin: 1em;       /* 24px * 1 = 24px */
  }
  
  .rem-example {
    font-size: 1.2rem; /* 基于根元素: 16px * 1.2 = 19.2px */
    width: 10rem;       /* 16px * 10 = 160px */
    height: 5rem;       /* 16px * 5 = 80px */
    background-color: lightgreen;
    margin: 1rem;       /* 16px * 1 = 16px */
  }
  
  .viewport-example {
    width: 50vw;        /* 视口宽度的50% */
    height: 25vh;       /* 视口高度的25% */
    background-color: lightyellow;
    margin: 2vh;        /* 视口高度的2% */
  }
</style>
</head>
<body>
  <div class="container">
    <div class="px-example">px单位示例：固定大小</div>
    <div class="em-example">em单位示例：相对于当前字体大小</div>
    <div class="rem-example">rem单位示例：相对于根元素字体大小</div>
    <div class="viewport-example">视口单位示例：相对于浏览器窗口</div>
  </div>
</body>
</html>
```

### 4. 各单位使用场景对比

| 单位 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| px | 精确控制的场景，如边框、图标等 | 精确、易理解 | 不够灵活，难以适配 |
| em | 需要相对缩放的场景，如组件内部 | 相对灵活 | 嵌套时计算复杂 |
| rem | 全局统一的相对单位 | 统一基准，易于管理 | 需要设置根元素基准值 |
| vh/vw | 全屏或视口相关的布局 | 响应式友好 | 在移动设备上可能有兼容性问题 |

### 5. 响应式设计中的应用

```css
/* 响应式设计示例 */
.responsive-text {
  font-size: 1.2rem;    /* 使用rem保持整体比例 */
}

.responsive-container {
  width: 90vw;          /* 使用vw适应不同屏幕宽度 */
  max-width: 1200px;    /* 设置最大宽度 */
  min-height: 50vh;     /* 使用vh确保最小高度 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px;    /* 在小屏幕上调整rem基准 */
  }
}
```

### 6. 最佳实践建议

1. **px**: 用于需要精确控制的元素，如边框、图标尺寸
2. **rem**: 用于字体大小、间距等需要全局一致比例的元素
3. **em**: 用于组件内部元素的相对尺寸控制
4. **vh/vw**: 用于全屏布局、响应式设计

选择合适的单位能让页面在不同设备和屏幕尺寸下有更好的表现。