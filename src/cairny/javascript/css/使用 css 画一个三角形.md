---
title: 使用 css 画一个三角形
---

在 CSS 中，可以通过多种方式来绘制一个三角形。以下是几种常用的方法：

---

### 方法一：使用 `border` 技术（最常用）

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

- 原理：通过设置左右边框为透明，底部边框为颜色，形成一个三角形。
- 优点：兼容性好，性能高。

---

### 方法二：使用 `clip-path`

```css
.triangle {
  width: 100px;
  height: 100px;
  background: red;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

- 原理：使用 `polygon` 定义裁剪区域，形成三角形。
- 优点：更灵活，可以绘制任意形状。

---

### 方法三：使用 `transform: rotate` + 伪元素

```css
.triangle {
  position: relative;
  width: 0;
  height: 0;
}

.triangle::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  background: red;
  transform: rotate(45deg);
  transform-origin: top left;
}
```

- 原理：通过旋转一个正方形形成三角形的视觉效果。
- 优点：适合动画和旋转场景。

---

### 方法四：使用 `linear-gradient` 渐变背景（仅限等腰三角形）

```css
.triangle {
  width: 100px;
  height: 100px;
  background: linear-gradient(to bottom right, transparent 50%, red 50%);
}
```

- 原理：通过渐变色分界线形成三角形。
- 优点：适合背景图案中使用。

---

### 方法五：使用 SVG（非纯 CSS，但常用于图形）

```html
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,0 0,100 100,100" fill="red" />
</svg>
```

- 原理：使用 SVG 的 `<polygon>` 元素定义三角形顶点。
- 优点：精确控制形状，适合复杂图形。

---

### 总结

| 方法              | 优点     | 适用场景   |
| ----------------- | -------- | ---------- |
| `border`          | 简洁高效 | 基本三角形 |
| `clip-path`       | 灵活多变 | 多边形裁剪 |
| `transform`       | 动画友好 | 动态旋转   |
| `linear-gradient` | 背景融合 | 背景装饰   |
| SVG               | 精确控制 | 图形设计   |

你可以根据具体需求选择合适的方法。