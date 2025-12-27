---
title: Canvas
---

## Canvas 简介

`<canvas>` 是 HTML5 中的一个重要元素，它提供了一个可以使用 JavaScript 进行绘制的区域。Canvas 本身只是一个容器，真正的绘图工作需要通过 JavaScript 和 Canvas API 来完成。

## Canvas 基本用法

### 1. 创建 Canvas 元素

```html
<canvas id="myCanvas" width="500" height="300"></canvas>
```

### 2. 获取绘图上下文

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
```

### 3. 基本绘制操作

```javascript
// 绘制矩形
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50);

// 绘制边框矩形
ctx.strokeStyle = 'red';
ctx.strokeRect(130, 10, 100, 50);

// 绘制圆形
ctx.beginPath();
ctx.arc(200, 150, 40, 0, Math.PI * 2);
ctx.fillStyle = 'green';
ctx.fill();
```

## Canvas 主要特性

### 绘图上下文类型

- **2D 上下文**: `getContext('2d')` - 用于二维图形绘制
- **WebGL 上下文**: `getContext('webgl')` 或 `getContext('experimental-webgl')` - 用于三维图形渲染

### 坐标系统

Canvas 使用二维坐标系统：
- 原点(0,0)位于画布左上角
- X轴向右为正方向
- Y轴向下为正方向

### 基本绘图功能

1. **路径绘制**
   - `beginPath()`: 开始新路径
   - `moveTo(x, y)`: 移动到指定点
   - `lineTo(x, y)`: 绘制直线到指定点
   - `arc()`: 绘制圆弧
   - `closePath()`: 闭合路径

2. **样式设置**
   - `fillStyle`: 设置填充颜色
   - `strokeStyle`: 设置描边颜色
   - `lineWidth`: 设置线条宽度

3. **文本绘制**
   - `fillText()`: 填充文本
   - `strokeText()`: 描边文本
   - `font`: 设置字体样式

4. **图像处理**
   - `drawImage()`: 绘制图像
   - `getImageData()`: 获取图像数据
   - `putImageData()`: 放置图像数据

## Canvas 应用场景

- **数据可视化**: 图表、统计图绘制
- **游戏开发**: 2D游戏画面渲染
- **图像处理**: 滤镜效果、图像编辑
- **动画制作**: 各种动态效果实现
- **交互式应用**: 绘图板、白板工具

## 性能考虑

- Canvas 是即时模式绘图，每次重绘都需要重新执行所有绘图命令
- 对于复杂动画，需要优化绘制逻辑，避免不必要的重绘
- 可以使用 `requestAnimationFrame()` 实现流畅动画

Canvas 提供了强大的客户端图形处理能力，是现代Web应用中实现丰富视觉效果的重要技术之一。
