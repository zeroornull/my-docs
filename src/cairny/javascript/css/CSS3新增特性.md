---
title: CSS3新增了哪些特性
---

## CSS3 新增特性详解

CSS3 是 CSS 的最新版本，引入了大量新特性和模块，极大地增强了网页的表现力和设计能力。

### 1. 选择器增强

#### 新增选择器类型：

- **属性选择器增强**：
  ```css
  /* 包含特定属性值 */
  input[type="text"] { color: blue; }
  
  /* 属性值以特定值开头 */
  a[href^="https"] { color: green; }
  
  /* 属性值以特定值结尾 */
  a[href$=".pdf"] { color: red; }
  
  /* 属性值包含特定值 */
  a[href*="example"] { color: orange; }
  ```

- **结构伪类选择器**：
  ```css
  /* 选择父元素的第一个子元素 */
  :first-child { }
  
  /* 选择父元素的最后一个子元素 */
  :last-child { }
  
  /* 选择父元素的第n个子元素 */
  :nth-child(2n) { }
  
  /* 选择父元素的第n个特定类型元素 */
  p:nth-of-type(2n+1) { }
  
  /* 选择没有兄弟元素的元素 */
  :only-child { }
  ```

- **其他伪类选择器**：
  ```css
  /* 目标元素（URL中的锚点） */
  :target { }
  
  /* 否定选择器 */
  :not(.class) { }
  ```

### 2. 盒模型增强

#### Border-radius（圆角边框）：
```css
.rounded-box {
  border-radius: 10px;
  /* 单独设置每个角 */
  border-top-left-radius: 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 20px;
  
  /* 椭圆圆角 */
  border-radius: 10px / 20px;
}
```

#### Box-shadow（阴影效果）：
```css
.shadow-box {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.3);
  
  /* 内阴影 */
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.3);
  
  /* 多重阴影 */
  box-shadow: 2px 2px 5px red, -2px -2px 5px blue;
}
```

#### Border-image（边框图片）：
```css
.image-border {
  border-image: url(border.png) 30 round;
  border-width: 10px;
}
```

### 3. 背景增强

#### 多背景支持：
```css
.multi-bg {
  background-image: url(img1.jpg), url(img2.jpg);
  background-position: left top, right bottom;
  background-repeat: no-repeat, repeat;
}
```

#### 背景尺寸控制：
```css
.bg-size {
  background-size: cover;    /* 覆盖整个容器 */
  background-size: contain;  /* 完整显示在容器内 */
  background-size: 50% 100%; /* 指定具体尺寸 */
}
```

#### 背景原点和裁剪：
```css
.bg-controls {
  background-origin: border-box | padding-box | content-box;
  background-clip: border-box | padding-box | content-box;
}
```

### 4. 渐变（Gradients）

#### 线性渐变：
```css
.linear-gradient {
  background: linear-gradient(to right, red, blue);
  background: linear-gradient(45deg, red, yellow, green);
  background: linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,0,0,1));
}
```

#### 径向渐变：
```css
.radial-gradient {
  background: radial-gradient(circle, red, yellow, green);
  background: radial-gradient(ellipse at center, red 0%, blue 100%);
}
```

### 5. 变形（Transform）

#### 2D 变形：
```css
.transform-2d {
  transform: translate(10px, 20px);    /* 位移 */
  transform: rotate(45deg);             /* 旋转 */
  transform: scale(1.5, 0.5);          /* 缩放 */
  transform: skew(30deg, 20deg);        /* 倾斜 */
  transform: matrix(1, 0.5, -0.5, 1, 0, 0); /* 矩阵变换 */
}
```

#### 3D 变形：
```css
.transform-3d {
  transform: translate3d(10px, 20px, 30px);
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);
  transform: perspective(500px) rotateY(45deg);
}
```

### 6. 过渡（Transition）

```css
.transition-example {
  width: 100px;
  height: 100px;
  background-color: red;
  
  /* 所有属性过渡 */
  transition: all 0.5s ease-in-out;
  
  /* 特定属性过渡 */
  transition: width 0.3s linear, background-color 0.5s ease;
}

.transition-example:hover {
  width: 200px;
  background-color: blue;
}
```

### 7. 动画（Animation）

```css
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animated-element {
  animation: slideIn 2s ease-in-out infinite alternate;
  /* animation: name duration timing-function delay iteration-count direction fill-mode play-state */
}
```

### 8. 多列布局（Multi-column）

```css
.multi-column {
  column-count: 3;           /* 列数 */
  column-gap: 20px;          /* 列间距 */
  column-rule: 1px solid #ccc; /* 列间分隔线 */
  column-width: 200px;       /* 列宽 */
  column-span: all;          /* 跨所有列 */
}
```

### 9. 弹性盒子（Flexbox）

```css
.flex-container {
  display: flex;
  flex-direction: row | column;     /* 主轴方向 */
  justify-content: center;          /* 主轴对齐 */
  align-items: center;              /* 交叉轴对齐 */
  flex-wrap: wrap;                  /* 换行 */
}

.flex-item {
  flex: 1;                          /* 弹性增长 */
  flex: 0 1 auto;                   /* flex-grow flex-shrink flex-basis */
  align-self: flex-start;           /* 单独对齐 */
}
```

### 10. 网格布局（Grid）

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
```

### 11. 媒体查询增强

```css
/* 基础媒体查询 */
@media screen and (max-width: 768px) {
  .responsive-element { }
}

/* 复杂媒体查询 */
@media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .tablet-landscape { }
}

/* 设备特性查询 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

### 12. 文本增强

#### 文本阴影：
```css
.text-shadow {
  text-shadow: 2px 2px 3px rgba(0,0,0,0.5);
}
```

#### 文本溢出处理：
```css
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

#### 文字换行控制：
```css
.word-wrap {
  word-wrap: break-word;
  word-break: break-all;
}
```

### 13. 颜色增强

#### RGBA 颜色：
```css
.rgba-color {
  color: rgba(255, 0, 0, 0.5); /* 红色，50%透明度 */
  background-color: rgba(0, 0, 255, 0.3);
}
```

#### HSLA 颜色：
```css
.hsla-color {
  color: hsla(120, 100%, 50%, 0.7); /* 绿色，70%透明度 */
}
```

### 14. 自定义字体（Web Fonts）

```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.custom-font {
  font-family: 'MyCustomFont', Arial, sans-serif;
}
```

### 15. 用户界面属性

```css
.ui-properties {
  resize: both;              /* 可调整大小 */
  outline: 2px solid blue;   /* 轮廓 */
  cursor: pointer;           /* 鼠标指针 */
  user-select: none;         /* 禁止选择文本 */
}
```

这些 CSS3 特性极大地增强了网页设计的可能性，让开发者能够创建更丰富、更动态的用户界面，同时保持更好的语义化和可维护性。