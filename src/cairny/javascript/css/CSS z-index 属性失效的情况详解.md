---
title: CSS z-index 属性失效的情况详解
---

## CSS `z-index` 属性失效的情况详解

### 1. 什么是 `z-index`

`z-index` 属性控制元素在 Z 轴（垂直于屏幕）上的堆叠顺序，值越大越靠前显示。

```css
.element {
  position: relative; /* 或 absolute, fixed */
  z-index: 10;
}
```

### 2. `z-index` 失效的主要情况

#### 2.1 元素没有定位属性（最重要）

**最常见的失效情况：**

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .box1 {
    width: 100px;
    height: 100px;
    background: red;
    z-index: 9999; /* 无效，因为没有定位 */
  }
  
  .box2 {
    width: 100px;
    height: 100px;
    background: blue;
    margin-top: -50px;
    z-index: 1; /* 无效，因为没有定位 */
  }
</style>
</head>
<body>
  <div class="box1"></div>
  <div class="box2"></div>
  <!-- box2 会覆盖 box1，即使 z-index 设置很高 -->
</body>
</html>
```

**正确做法：**
```css
.box1 {
  position: relative; /* 添加定位 */
  width: 100px;
  height: 100px;
  background: red;
  z-index: 2;
}

.box2 {
  position: relative; /* 添加定位 */
  width: 100px;
  height: 100px;
  background: blue;
  margin-top: -50px;
  z-index: 1;
}
```

#### 2.2 层叠上下文（Stacking Context）限制

当元素创建了新的层叠上下文时，其子元素的 `z-index` 只在该上下文内部生效。

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .parent1 {
    position: relative;
    z-index: 1; /* 创建层叠上下文 */
    background: lightgray;
  }
  
  .child1 {
    position: relative;
    z-index: 9999; /* 在 parent1 的上下文中，但无法超越 parent2 */
    background: red;
    width: 100px;
    height: 100px;
  }
  
  .parent2 {
    position: relative;
    z-index: 2; /* 比 parent1 高 */
    background: lightblue;
    margin-top: -50px;
  }
  
  .child2 {
    position: relative;
    z-index: 1; /* 在 parent2 的上下文中 */
    background: blue;
    width: 100px;
    height: 100px;
  }
</style>
</head>
<body>
  <div class="parent1">
    <div class="child1">Child 1 (z-index: 9999)</div>
  </div>
  <div class="parent2">
    <div class="child2">Child 2 (z-index: 1)</div>
  </div>
  <!-- child2 仍然在 child1 上面，因为 parent2 的 z-index 更高 -->
</body>
</html>
```

#### 2.3 opacity 小于 1

```css
.element {
  opacity: 0.9; /* 创建新的层叠上下文 */
  z-index: 9999; /* 在该上下文内有效，但受父级限制 */
}
```

#### 2.4 transform 属性

```css
.element {
  transform: translateZ(0); /* 创建新的层叠上下文 */
  z-index: 9999; /* 受限于新的上下文 */
}
```

#### 2.5 filter 属性

```css
.element {
  filter: blur(1px); /* 创建新的层叠上下文 */
  z-index: 9999;
}
```

### 3. 创建层叠上下文的情况

以下属性会创建新的层叠上下文，限制子元素的 `z-index`：

```css
/* 1. 根元素 */
html

/* 2. position 值为 relative/absolute/fixed 且 z-index 不为 auto */
.element {
  position: relative;
  z-index: 1;
}

/* 3. opacity 小于 1 */
.element {
  opacity: 0.5;
}

/* 4. transform 不为 none */
.element {
  transform: scale(1.1);
}

/* 5. filter 不为 none */
.element {
  filter: blur(2px);
}

/* 6. will-change 指定会创建层叠上下文的属性 */
.element {
  will-change: transform;
}

/* 7. isolation 设置为 isolate */
.element {
  isolation: isolate;
}

/* 8. mix-blend-mode 不为 normal */
.element {
  mix-blend-mode: multiply;
}

/* 9. perspective 不为 none */
.element {
  perspective: 1000px;
}
```

### 4. 解决 `z-index` 失效的方法

#### 方法一：确保元素有定位属性

```css
.modal {
  position: fixed; /* 必须有定位 */
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

#### 方法二：调整层叠上下文

```css
/* 错误示例 */
.container {
  opacity: 0.9; /* 创建了层叠上下文 */
}

.modal {
  position: fixed;
  z-index: 9999; /* 但受限于 container 的上下文 */
}

/* 正确示例 */
.container {
  /* 移除 opacity 或调整结构 */
}

.modal {
  position: fixed;
  z-index: 9999;
}
```

#### 方法三：重新组织 HTML 结构

```html
<!-- 错误结构 -->
<div class="wrapper">
  <div class="content">
    <div class="modal">Modal Content</div>
  </div>
  <div class="overlay"></div>
</div>

<!-- 正确结构 -->
<div class="wrapper">
  <div class="content">
    <!-- 内容 -->
  </div>
  <div class="overlay"></div>
  <div class="modal">Modal Content</div>
</div>
```

### 5. 层叠顺序（从后到前）

在同一个层叠上下文中，元素按照以下顺序堆叠：

```css
/*
层叠顺序（从后到前）：
1. 根元素背景和边框
2. z-index 为负值的定位元素
3. 普通文档流中的块级元素
4. 浮动元素
5. 普通文档流中的内联元素
6. z-index 为 0 或 auto 的定位元素
7. z-index 为正值的定位元素
*/
```

### 6. 实际应用示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
  }
  
  .demo-container {
    position: relative;
    width: 300px;
    height: 200px;
    border: 1px solid #ccc;
    margin: 20px;
  }
  
  /* 正确使用 z-index */
  .correct-example .box1 {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 100px;
    height: 100px;
    background: red;
    z-index: 1;
  }
  
  .correct-example .box2 {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 100px;
    height: 100px;
    background: blue;
    z-index: 2; /* 有效，因为有定位 */
  }
  
  /* 层叠上下文限制示例 */
  .stacking-context .parent1 {
    position: relative;
    z-index: 1;
    background: rgba(200, 200, 200, 0.5);
    padding: 10px;
  }
  
  .stacking-context .child1 {
    position: relative;
    z-index: 9999; /* 在 parent1 内部有效，但无法超越 parent2 */
    background: red;
    width: 80px;
    height: 80px;
  }
  
  .stacking-context .parent2 {
    position: relative;
    z-index: 2; /* 比 parent1 高 */
    background: rgba(173, 216, 230, 0.5);
    padding: 10px;
    margin-top: -40px;
  }
  
  .stacking-context .child2 {
    position: relative;
    z-index: 1;
    background: blue;
    width: 80px;
    height: 80px;
  }
</style>
</head>
<body>
  <h2>正确使用 z-index</h2>
  <div class="demo-container correct-example">
    <div class="box1">Box 1 (z-index: 1)</div>
    <div class="box2">Box 2 (z-index: 2)</div>
  </div>
  
  <h2>层叠上下文限制</h2>
  <div class="demo-container stacking-context">
    <div class="parent1">
      <div class="child1">Child 1 (z-index: 9999)</div>
    </div>
    <div class="parent2">
      <div class="child2">Child 2 (z-index: 1)</div>
    </div>
    <p>注意：尽管 Child 1 的 z-index 很高，但 Parent 2 的 z-index 更高，所以 Child 2 在上面</p>
  </div>
</body>
</html>
```

### 7. 调试技巧

1. **使用浏览器开发者工具**：查看元素的层叠上下文
2. **临时添加边框**：帮助识别元素位置
3. **逐步调试**：从简单的两层结构开始测试
4. **检查父元素**：确认是否创建了新的层叠上下文

### 8. 最佳实践建议

1. **只在必要时使用定位和 z-index**
2. **保持 z-index 值的简洁**：使用 1, 2, 3 而不是 9999, 10000
3. **理解层叠上下文的概念**
4. **合理组织 HTML 结构**
5. **使用 CSS 变量管理 z-index 层级**

通过理解这些原则，可以有效避免 `z-index` 失效的问题，创建正确的层叠效果。