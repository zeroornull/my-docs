---
title: 使用CSS提高页面性能
---

# 使用CSS提高页面性能详解

CSS性能优化是前端性能优化的重要组成部分。通过合理的CSS编写和优化策略，可以显著提升页面加载速度和渲染性能。

## 1. CSS选择器优化

### 1.1 避免低效选择器

```css
/* 不推荐：通用选择器效率低 */
* {
    margin: 0;
    padding: 0;
}

/* 不推荐：后代选择器层级过深 */
.container .sidebar .menu .item a {
    color: blue;
}

/* 不推荐：通配符选择器 */
ul[class*="menu"] li {
    list-style: none;
}

/* 推荐：使用具体类名 */
.menu-item-link {
    color: blue;
}

/* 推荐：简化选择器 */
.main-menu-item {
    list-style: none;
}
```

### 1.2 优化选择器结构

```css
/* 不推荐：从右到左匹配效率低 */
.header .nav ul li a {
    color: #333;
}

/* 推荐：使用直接子选择器 */
.nav > li > a {
    color: #333;
}

/* 推荐：使用类选择器而非标签选择器 */
.navigation-link {
    color: #333;
}

/* 推荐：避免ID和类的冗余 */
/* 不需要写成 #header .menu-item */
.menu-item {
    /* 样式 */
}
```

## 2. CSS文件优化

### 2.1 文件压缩和合并

```css
/* 开发版本 - 可读性强 */
.header {
    background-color: #333333;
    color: #ffffff;
    padding: 20px;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
}

/* 生产版本 - 压缩后 */
.header{background-color:#333;color:#fff;padding:20px;margin:0 auto;width:100%;max-width:1200px}
```

### 2.2 按需加载CSS

```html
<!-- 关键CSS内联 -->
<style>
  .header { display: flex; }
  .main { min-height: 100vh; }
</style>

<!-- 非关键CSS异步加载 -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### 2.3 使用CSS Sprites

```css
/* 雪碧图优化 */
.icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url('icons-sprite.png');
    background-repeat: no-repeat;
}

.icon-home {
    background-position: 0 0;
}

.icon-user {
    background-position: -16px 0;
}

.icon-settings {
    background-position: -32px 0;
}
```

## 3. 减少重绘和回流

### 3.1 使用transform和opacity

```css
/* 不推荐：触发回流 */
.bad-animation {
    left: 100px;        /* 触发回流 */
    top: 100px;         /* 触发回流 */
    width: 200px;       /* 触发回流 */
    height: 200px;      /* 触发回流 */
}

/* 推荐：只触发合成 */
.good-animation {
    transform: translate(100px, 100px) scale(1.2); /* 只触发合成 */
    opacity: 0.8;       /* 只触发合成 */
}
```

### 3.2 批量修改样式

```javascript
// 不推荐：多次修改触发多次回流
const element = document.querySelector('.box');
element.style.left = '10px';
element.style.top = '10px';
element.style.width = '100px';
element.style.height = '100px';

// 推荐：批量修改
element.style.cssText = 'left: 10px; top: 10px; width: 100px; height: 100px;';

// 或者使用类名
element.classList.add('new-position');
```

```css
.new-position {
    left: 10px;
    top: 10px;
    width: 100px;
    height: 100px;
}
```

### 3.3 使用will-change属性

```css
/* 提示浏览器元素将要发生变化 */
.animated-element {
    will-change: transform, opacity;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.moving-element {
    will-change: transform;
}

.moving-element:hover {
    transform: translateX(10px);
}
```

## 4. CSS动画性能优化

### 4.1 使用硬件加速

```css
/* 启用硬件加速 */
.hardware-accelerated {
    transform: translateZ(0);
    /* 或者 */
    transform: translate3d(0, 0, 0);
}

/* 优化动画性能 */
.optimized-animation {
    animation: slideIn 0.5s ease-out;
    will-change: transform;
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}
```

### 4.2 避免动画中的性能瓶颈属性

```css
/* 高性能动画属性 */
.high-performance {
    /* 推荐使用 */
    transform: translate(100px, 100px);
    transform: scale(1.2);
    transform: rotate(45deg);
    opacity: 0.5;
}

/* 低性能动画属性 */
.low-performance {
    /* 避免在动画中使用 */
    left: 100px;        /* 触发回流 */
    top: 100px;         /* 触发回流 */
    width: 200px;       /* 触发回流 */
    height: 200px;      /* 触发回流 */
    margin: 20px;       /* 触发回流 */
    padding: 10px;      /* 触发回流 */
    border-width: 2px;  /* 触发回流 */
}
```

## 5. 布局优化

### 5.1 使用Flexbox和Grid

```css
/* 使用现代布局避免浮动 */
.flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

/* 避免传统浮动布局 */
/* 不推荐 */
.float-container {
    overflow: hidden; /* 清除浮动 */
}

.float-item {
    float: left;
    width: 33.33%;
}
```

### 5.2 避免复杂布局计算

```css
/* 不推荐：复杂的表格布局 */
.complex-table {
    display: table;
    table-layout: fixed;
    width: 100%;
}

/* 推荐：使用Flexbox或Grid */
.simple-layout {
    display: flex;
    flex-direction: column;
}
```

## 6. 字体优化

### 6.1 字体加载优化

```css
/* 使用font-display属性优化字体加载 */
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap; /* 立即显示后备字体，加载完成后替换 */
}

/* 字体子集化 */
@font-face {
    font-family: 'ChineseFont';
    src: url('chinese-subset.woff2') format('woff2');
    unicode-range: U+4E00-9FFF; /* 只包含中文字符 */
}
```

### 6.2 避免过多字体变化

```css
/* 不推荐：过多字体变化 */
.bad-typography {
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
    word-spacing: 0;
    text-transform: none;
}

/* 推荐：保持字体简单 */
.good-typography {
    font-family: system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
}
```

## 7. 图片和媒体优化

### 7.1 响应式图片

```css
/* 响应式图片基础样式 */
.responsive-img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* 使用object-fit控制图片显示 */
.cover-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    object-position: center;
}
```

### 7.2 背景图片优化

```css
/* 使用媒体查询为不同设备提供不同质量的图片 */
.hero-bg {
    background-image: url('hero-mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-resolution: 2dppx) {
    .hero-bg {
        background-image: url('hero-mobile@2x.jpg');
    }
}

@media (min-width: 768px) {
    .hero-bg {
        background-image: url('hero-desktop.jpg');
    }
    
    @media (min-resolution: 2dppx) {
        .hero-bg {
            background-image: url('hero-desktop@2x.jpg');
        }
    }
}
```

## 8. CSS变量和预处理器优化

### 8.1 合理使用CSS变量

```css
:root {
    /* 定义常用变量减少重复 */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --border-radius: 4px;
    --transition-speed: 0.3s;
}

.button {
    background-color: var(--primary-color);
    border-radius: var(--border-radius);
    transition: all var(--transition-speed) ease;
}

/* 避免过度嵌套变量 */
/* 不推荐 */
:root {
    --color-primary: #007bff;
    --button-bg: var(--color-primary);
    --button-hover-bg: color-mix(in srgb, var(--button-bg), black 10%);
}
```

## 9. 减少CSS文件大小

### 9.1 移除未使用的CSS

```css
/* 使用工具检测未使用的CSS */
/* 例如使用 PurgeCSS, UnCSS 等工具 */

/* 在开发阶段可以使用以下技巧 */
.deprecated-feature {
    /* 已废弃的功能，可以移除 */
    /* color: red; */
}

/* 使用CSS注释标记待移除代码 */
/*
.TODO: 移除此样式，新版设计不需要
.old-design {
    background: url('old-bg.png');
}
*/
```

### 9.2 使用简写属性

```css
/* 不推荐：分开写属性 */
.padding-separate {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
}

/* 推荐：使用简写属性 */
.padding-shorthand {
    padding: 10px 20px;
}

/* 不推荐：分开写背景属性 */
.background-separate {
    background-color: #fff;
    background-image: url('bg.png');
    background-repeat: no-repeat;
    background-position: center;
}

/* 推荐：使用简写背景属性 */
.background-shorthand {
    background: #fff url('bg.png') no-repeat center;
}
```

## 10. 关键渲染路径优化

### 10.1 内联关键CSS

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 内联关键CSS -->
    <style>
        /* 首屏渲染必需的样式 */
        .header { height: 60px; background: #333; }
        .main { min-height: calc(100vh - 60px); }
        .hero { height: 400px; background: url('hero.jpg'); }
    </style>
    
    <!-- 非关键CSS异步加载 -->
    <link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 10.2 使用媒体查询条件加载

```html
<!-- 只在打印时加载打印样式 -->
<link rel="stylesheet" href="print.css" media="print">

<!-- 只在大屏幕上加载大屏样式 -->
<link rel="stylesheet" href="desktop.css" media="(min-width: 1024px)">

<!-- 只在高分辨率屏幕上加载高清样式 -->
<link rel="stylesheet" href="high-dpi.css" media="(-webkit-min-device-pixel-ratio: 2)">
```

## 11. 实际优化示例

### 11.1 优化前的CSS

```css
/* 优化前 - 存在性能问题 */
.complex-component {
    position: relative;
    width: 300px;
    height: 200px;
    margin: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.complex-component:hover {
    margin: 25px;           /* 触发回流 */
    padding: 20px;          /* 触发回流 */
    width: 310px;           /* 触发回流 */
    height: 210px;          /* 触发回流 */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

### 11.2 优化后的CSS

```css
/* 优化后 - 提升性能 */
.optimized-component {
    position: relative;
    width: 300px;
    height: 200px;
    margin: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    /* 使用transform替代布局属性变化 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    will-change: transform, box-shadow;
}

.optimized-component:hover {
    transform: translate(-5px, -5px) scale(1.02); /* 只触发合成 */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

## 12. 性能监控和测试

### 12.1 使用浏览器开发者工具

```javascript
// 监听重绘和回流事件（部分浏览器支持）
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log('Layout triggered:', entry);
    }
});

observer.observe({entryTypes: ['layout-shift']});
```

### 12.2 CSS性能测试

```css
/* 使用CSS containment隔离样式影响 */
.isolated-component {
    contain: layout style paint;
}

/* 使用content-visibility延迟渲染 */
.lazy-component {
    content-visibility: auto;
    contain-intrinsic-size: 100px;
}
```

## 总结

CSS性能优化的关键点包括：

1. **选择器优化**：使用高效的选择器，避免复杂嵌套
2. **减少重绘回流**：优先使用transform和opacity属性
3. **文件优化**：压缩合并CSS，按需加载
4. **动画优化**：使用硬件加速，避免低性能属性
5. **布局优化**：使用现代布局方式，避免复杂计算
6. **关键路径优化**：内联关键CSS，异步加载非关键CSS

通过实施这些优化策略，可以显著提升页面的加载速度和运行时性能，为用户提供更好的体验。