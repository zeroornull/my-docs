---
title: obiect-fit 用法
---

## `object-fit` 用法详解

`object-fit` 是 CSS3 中的一个属性，用于控制替换元素（如 `<img>` 和 `<video>`）的内容如何适应其容器的尺寸。

---

### 一、基本语法

```css
img {
  object-fit: fill | contain | cover | none | scale-down;
}
```

---

### 二、各值详解

#### 1. `fill`（默认值）
拉伸图片以完全填满容器，不保持宽高比。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: fill;
}
```

```html
<img src="example.jpg" alt="Fill example">
```

效果：图片被拉伸变形以完全填充 300×200 的容器。

#### 2. `contain`
保持图片宽高比，完整显示图片，可能会有空白区域。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: contain;
  background: #f0f0f0; /* 显示背景色以看出空白区域 */
}
```

效果：图片完整显示在容器内，上下或左右可能有空白。

#### 3. `cover`（最常用）
保持图片宽高比，填满整个容器，可能会裁剪部分内容。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: cover;
}
```

效果：图片完全覆盖容器，但可能被裁剪，常用于头像、封面图。

#### 4. `none`
保持图片原始尺寸，不进行任何缩放。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: none;
}
```

效果：图片保持原始大小，可能会溢出容器或显示不完整。

#### 5. `scale-down`
在 `none` 和 `contain` 中选择尺寸较小的一个。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: scale-down;
}
```

效果：如果原始图片比容器小，则保持原尺寸；如果比容器大，则按 `contain` 方式缩放。

---

### 三、配合 `object-position` 使用

`object-position` 用于控制图片在容器中的位置。

```css
img {
  width: 300px;
  height: 200px;
  object-fit: cover;
  object-position: center top; /* 从顶部中心开始裁剪 */
}

img.left {
  object-position: left center; /* 从左侧中心开始裁剪 */
}

img.right {
  object-position: right bottom; /* 从右下角开始裁剪 */
}
```

---

### 四、实际应用示例

#### 1. 响应式图片画廊

```html
<div class="gallery">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.gallery img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

#### 2. 用户头像统一尺寸

```html
<div class="user-profile">
  <img class="avatar" src="user-avatar.jpg" alt="User Avatar">
  <span class="username">用户名</span>
</div>
```

```css
.avatar {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

#### 3. 视频封面图处理

```html
<div class="video-container">
  <video poster="video-poster.jpg" controls>
    <source src="video.mp4" type="video/mp4">
  </video>
</div>
```

```css
.video-container video {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}
```

#### 4. 响应式卡片布局

```html
<div class="card">
  <img src="card-image.jpg" alt="Card Image">
  <div class="card-content">
    <h3>卡片标题</h3>
    <p>卡片描述内容...</p>
  </div>
</div>
```

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}
```

#### 5. 英雄区域（Hero Section）

```html
<section class="hero">
  <img src="hero-background.jpg" alt="Hero Background">
  <div class="hero-content">
    <h1>欢迎来到我们的网站</h1>
    <p>这里是主要内容</p>
  </div>
</section>
```

```css
.hero {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1;
}
```

---

### 五、浏览器兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 31+ |
| Firefox | 36+ |
| Safari | 10+ |
| Edge | 16+ |
| IE | 不支持 |

对于不支持的浏览器，可以使用以下 polyfill 或降级方案：

```css
/* 降级方案 */
img {
  width: 100%;
  height: auto; /* 保持宽高比 */
}

@supports (object-fit: cover) {
  img {
    height: 200px;
    object-fit: cover;
  }
}
```

---

### 六、与背景图片的区别

#### 使用 `object-fit`：
```html
<img src="image.jpg" alt="Description">
```

```css
img {
  width: 300px;
  height: 200px;
  object-fit: cover;
}
```

#### 使用背景图片：
```html
<div class="image-container"></div>
```

```css
.image-container {
  width: 300px;
  height: 200px;
  background-image: url('image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

#### 对比：

| 特性 | `object-fit` | 背景图片 |
|------|--------------|----------|
| 语义化 | 有语义（img标签） | 无语义 |
| SEO | 可索引 | 不可索引 |
| 可访问性 | 支持 alt 属性 | 不支持 |
| 加载性能 | 图片加载后显示 | 可预加载 |
| 控制精度 | 高 | 高 |
| 兼容性 | 现代浏览器 | 所有浏览器 |

---

### 七、最佳实践

1. **头像和缩略图**：使用 `object-fit: cover` 保持统一尺寸
2. **画廊和网格布局**：使用 `object-fit: cover` 或 `contain` 保持一致性
3. **响应式设计**：结合媒体查询调整不同屏幕下的 `object-fit` 值
4. **渐进增强**：为不支持的浏览器提供降级方案

```css
/* 推荐的通用图片样式 */
.responsive-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .responsive-image {
    height: 200px;
    object-position: top center; /* 移动端优先显示顶部 */
  }
}
```

---

### 八、总结

`object-fit` 是处理图片适应容器的重要 CSS 属性，特别适用于需要统一图片尺寸但保持视觉效果的场景。通过合理使用不同的值，可以有效解决图片变形、显示不完整等问题，提升用户体验。