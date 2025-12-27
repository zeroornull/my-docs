---
title: 相邻的两个inline-block节点为什么会出现间隔，该如何解决
---

## 为什么会出现间隔

相邻的两个 `inline-block` 元素之间出现间隔的原因是：

- **HTML中的空白字符**：当在HTML中书写 `inline-block` 元素时，元素之间的换行符、空格等空白字符会被浏览器解析为文本节点
- **默认渲染行为**：这些空白字符在渲染时会显示为元素间的间隙，通常为几个像素的宽度
- **字体影响**：间隙的大小通常与元素的 `font-size` 相关

## 解决方案

### 1. 移除HTML中的空白字符
```html
<!-- 方法一：直接连接元素 -->
<div class="container">
  <div class="item">Item 1</div><div class="item">Item 2</div>
</div>

<!-- 方法二：使用注释消除空白 -->
<div class="container">
  <div class="item">Item 1</div><!--
  --><div class="item">Item 2</div>
</div>
```

### 2. 设置父元素字体大小为0
```css
.container {
  font-size: 0;
}

.item {
  display: inline-block;
  font-size: 16px; /* 需要重新设置子元素字体大小 */
}
```

### 3. 使用浮动布局
```css
.item {
  float: left;
}

.container::after {
  content: "";
  display: table;
  clear: both;
}
```

### 4. 使用Flexbox布局（推荐）
```css
.container {
  display: flex;
}

.item {
  /* 不需要设置 display: inline-block */
}
```

### 5. 使用负边距
```css
.item {
  display: inline-block;
  margin-right: -4px; /* 根据实际情况调整 */
}
```

## 最佳实践建议

1. **优先使用Flexbox**：现代浏览器支持良好，语义清晰，无需处理间隙问题
2. **避免使用font-size: 0**：可能影响可访问性，且需要重新设置子元素字体大小
3. **考虑语义化**：根据实际需求选择合适的布局方式