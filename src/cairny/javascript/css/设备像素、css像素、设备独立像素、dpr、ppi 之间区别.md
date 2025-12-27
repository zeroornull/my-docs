---
title: 设备像素、css像素、设备独立像素、dpr、ppi 之间区别
---

## 设备像素、CSS像素、设备独立像素、DPR、PPI 之间的区别

这些概念是移动Web开发中的核心概念，理解它们对于实现高质量的响应式设计和适配不同设备至关重要。

---

### 一、基本概念定义

#### 1. **设备像素（Device Pixel / Physical Pixel）**
- 显示屏上最小的物理显示单元
- 是屏幕硬件的固有属性，无法改变
- 例如：iPhone 6 的屏幕有 750×1334 个物理像素点

#### 2. **CSS像素（CSS Pixel / Logical Pixel）**
- 浏览器使用的抽象单位
- 是Web开发中使用的逻辑单位
- 1 CSS像素在不同设备上可能对应不同数量的设备像素

#### 3. **设备独立像素（Device Independent Pixel / DIP）**
- 与设备无关的逻辑像素单位
- 在不同密度的设备上保持视觉大小一致
- Android 中的 dp 单位就是设备独立像素

#### 4. **设备像素比（Device Pixel Ratio / DPR）**
- 设备像素与CSS像素的比例关系
- 公式：DPR = 设备像素数 / CSS像素数
- 例如：DPR为2的设备上，1个CSS像素 = 2×2个设备像素

#### 5. **每英寸像素数（Pixels Per Inch / PPI）**
- 每英寸长度上的像素数量
- 衡量屏幕像素密度的指标
- PPI越高，屏幕显示越精细

---

### 二、关系图解

```
屏幕物理尺寸
    ↓
[设备像素] ←→ [PPI] ←→ 屏幕清晰度
    ↑ DPR
[CSS像素] ←→ Web开发使用
    ↓
[设备独立像素] ←→ 保持视觉一致性
```

---

### 三、具体示例分析

#### iPhone 6/7/8 示例：

| 属性 | 值 |
|------|-----|
| 屏幕尺寸 | 4.7英寸 |
| 设备像素 | 750 × 1334 |
| CSS像素 | 375 × 667 |
| DPR | 2 |
| PPI | 326 |

计算关系：
- DPR = 750 / 375 = 2
- PPI = √(750² + 1334²) / 4.7 ≈ 326

#### iPhone 6 Plus 示例：

| 属性 | 值 |
|------|-----|
| 屏幕尺寸 | 5.5英寸 |
| 设备像素 | 1242 × 2208 |
| CSS像素 | 414 × 736 |
| DPR | 3 |
| PPI | 401 |

---

### 四、DPR 常见值

| 设备类型 | DPR 值 | 示例设备 |
|----------|--------|----------|
| 低密度屏幕 | 1 | 早期iPhone、部分Android机 |
| 高密度屏幕 | 2 | iPhone 6/7/8、大部分现代手机 |
| 超高密度屏幕 | 3 | iPhone 6+/7+/8+、部分旗舰Android机 |
| 超高密度屏幕 | 4 | 部分高端Android机 |

---

### 五、实际应用

#### 1. **获取 DPR 的方法**

```javascript
// JavaScript 获取 DPR
const dpr = window.devicePixelRatio;
console.log('设备像素比:', dpr);

// CSS 媒体查询
@media (-webkit-min-device-pixel-ratio: 2) {
  /* 针对 DPR >= 2 的设备 */
}

// 或者使用标准写法
@media (min-resolution: 2dppx) {
  /* 针对 DPR >= 2 的设备 */
}
```

#### 2. **响应式图片处理**

```html
<!-- 使用 srcset 提供不同分辨率图片 -->
<img src="image-1x.jpg" 
     srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
     alt="响应式图片">
```

#### 3. **CSS 中的处理**

```css
/* 1px 边框在高DPR设备上的处理 */
.border-1px {
  position: relative;
}

.border-1px::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #000;
  transform: scaleY(0.5); /* DPR为2时 */
}

/* 媒体查询针对不同 DPR */
@media (-webkit-min-device-pixel-ratio: 2) {
  .border-1px::after {
    transform: scaleY(0.5);
  }
}

@media (-webkit-min-device-pixel-ratio: 3) {
  .border-1px::after {
    transform: scaleY(0.33);
  }
}
```

#### 4. **Canvas 绘制优化**

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio;

// 设置 canvas 实际大小
canvas.width = 300 * dpr;
canvas.height = 150 * dpr;

// 缩放绘制上下文
ctx.scale(dpr, dpr);

// 正常绘制
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 50);
```

---

### 六、各概念间的关系公式

1. **DPR 计算**：
   ```
   DPR = 设备像素数 / CSS像素数
   ```

2. **PPI 计算**：
   ```
   PPI = √(水平像素² + 垂直像素²) / 屏幕对角线英寸数
   ```

3. **实际渲染关系**：
   ```
   实际渲染像素数 = CSS像素数 × DPR²
   ```

---

### 七、常见问题和解决方案

#### 1. **1px 边框问题**
在高 DPR 设备上，1px 的边框看起来很粗：

```css
/* 解决方案：使用 transform 缩放 */
.thin-border {
  position: relative;
}

.thin-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #000;
  transform: scale(0.5);
  transform-origin: 0 0;
}
```

#### 2. **图片模糊问题**
在高 DPR 设备上使用低分辨率图片会模糊：

```html
<!-- 提供多倍图 -->
<picture>
  <source media="(min-resolution: 3dppx)" srcset="image@3x.jpg">
  <source media="(min-resolution: 2dppx)" srcset="image@2x.jpg">
  <img src="image@1x.jpg" alt="图片">
</picture>
```

---

### 八、总结对比表

| 概念 | 定义 | 特点 | 应用场景 |
|------|------|------|----------|
| 设备像素 | 物理像素点 | 固定不变 | 硬件规格 |
| CSS像素 | 逻辑像素单位 | Web开发使用 | 布局计算 |
| 设备独立像素 | 与设备无关的单位 | 保持视觉一致 | 跨设备适配 |
| DPR | 像素比例 | 影响渲染精度 | 高清适配 |
| PPI | 像素密度 | 衡量屏幕质量 | 设备分类 |

理解这些概念有助于开发出在各种设备上都能良好显示的Web应用，特别是在移动端开发中至关重要。