---
title: CSS 盒模型
---

## CSS 盒模型详解

### 什么是CSS盒模型

CSS盒模型（Box Model）是网页布局的基础概念，它将HTML元素视为一个个矩形盒子。每个盒子由四个部分组成：

1. **内容区域（Content）** - 显示实际内容的区域
2. **内边距（Padding）** - 内容与边框之间的空间
3. **边框（Border）** - 围绕内边距和内容的边界线
4. **外边距（Margin）** - 盒子与其他元素之间的空间

### 盒模型的两种类型

#### 1. 标准盒模型（W3C盒模型）
```css
/* 默认情况下使用标准盒模型 */
.box {
  box-sizing: content-box; /* 默认值 */
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid #000;
  margin: 10px;
}
/* 实际占用宽度 = 200 + 20*2 + 5*2 = 250px */
/* 实际占用高度 = 100 + 20*2 + 5*2 = 150px */
```

#### 2. 怪异盒模型（IE盒模型）
```css
/* 使用怪异盒模型 */
.box {
  box-sizing: border-box;
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid #000;
  margin: 10px;
}
/* 实际占用宽度 = 200px（包含padding和border） */
/* 实际占用高度 = 100px（包含padding和border） */
/* 内容区域宽度 = 200 - 20*2 - 5*2 = 150px */
/* 内容区域高度 = 100 - 20*2 - 5*2 = 50px */
```

### 盒模型各部分详解

#### 内容区域（Content）
- 显示文本、图片等实际内容的区域
- 宽度和高度由 `width` 和 `height` 属性控制

#### 内边距（Padding）
- 内容与边框之间的空白区域
- 可以设置四个方向的内边距：
  - `padding-top`
  - `padding-right`
  - `padding-bottom`
  - `padding-left`
  - 或使用简写属性 `padding`

#### 边框（Border）
- 围绕内边距和内容的边界
- 包含三个属性：宽度、样式、颜色
- 可以分别设置四个方向的边框

#### 外边距（Margin）
- 元素与其他元素之间的空白区域
- 不会影响元素本身，但会影响布局
- 可能出现外边距合并现象

### 实际应用示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
.example-container {
  width: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 20px;
}

.standard-box {
  box-sizing: content-box;
  width: 200px;
  height: 100px;
  padding: 15px;
  border: 3px solid blue;
  margin: 10px;
  background-color: lightblue;
}

.border-box {
  box-sizing: border-box;
  width: 200px;
  height: 100px;
  padding: 15px;
  border: 3px solid red;
  margin: 10px;
  background-color: lightcoral;
}

.visual-example {
  width: 150px;
  height: 80px;
  padding: 20px;
  border: 5px dashed green;
  margin: 15px;
  background-color: #f0f0f0;
}
</style>
</head>
<body>

<div class="example-container">
  <h3>标准盒模型示例</h3>
  <div class="standard-box">
    这是标准盒模型
    实际宽度: 200 + 15×2 + 3×2 = 236px
  </div>
  
  <h3>IE盒模型示例</h3>
  <div class="border-box">
    这是IE盒模型
    实际宽度: 200px（包含padding和border）
  </div>
</div>

<h3>盒模型可视化</h3>
<div class="visual-example">
  <div style="background-color: yellow; height: 100%;">
    <strong>内容区域</strong><br>
    padding: 20px<br>
    border: 5px dashed green<br>
    margin: 15px
  </div>
</div>

</body>
</html>
```

### 盒模型的实际计算

#### 标准盒模型计算方式：
```css
.element {
  width: 300px;        /* 内容宽度 */
  height: 200px;       /* 内容高度 */
  padding: 20px;       /* 四周内边距 */
  border: 5px solid;   /* 四周边框 */
  margin: 10px;        /* 四周外边距 */
}

/* 实际占用空间计算 */
/* 总宽度 = width + padding-left + padding-right + border-left + border-right + margin-left + margin-right */
/* 总宽度 = 300 + 20 + 20 + 5 + 5 + 10 + 10 = 370px */

/* 总高度 = height + padding-top + padding-bottom + border-top + border-bottom + margin-top + margin-bottom */
/* 总高度 = 200 + 20 + 20 + 5 + 5 + 10 + 10 = 270px */
```

#### IE盒模型计算方式：
```css
.element {
  box-sizing: border-box;
  width: 300px;        /* 包含padding和border的总宽度 */
  height: 200px;       /* 包含padding和border的总高度 */
  padding: 20px;
  border: 5px solid;
  margin: 10px;
}

/* 实际占用空间计算 */
/* 总宽度 = width + margin-left + margin-right = 300 + 10 + 10 = 320px */
/* 总高度 = height + margin-top + margin-bottom = 200 + 10 + 10 = 220px */

/* 内容区域宽度 = width - padding-left - padding-right - border-left - border-right */
/* 内容区域宽度 = 300 - 20 - 20 - 5 - 5 = 250px */
```

### 使用建议

1. **统一盒模型**：在项目开始时统一设置盒模型
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

2. **理解差异**：在做响应式设计时特别注意两种盒模型的差异

3. **调试技巧**：使用浏览器开发者工具查看盒模型信息

通过理解CSS盒模型，可以更精确地控制页面布局和元素尺寸，避免常见的布局问题。