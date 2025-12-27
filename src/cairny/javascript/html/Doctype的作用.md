---
title: Doctype的作用
---

## Doctype 的作用详解

### 1. 基本定义
`<!DOCTYPE>`（Document Type Declaration，文档类型声明）是 HTML 文档中的第一条声明，用于告诉浏览器当前文档使用的是哪种 HTML 或 XHTML 规范。

### 2. 主要作用

#### (1) 触发标准模式
- **标准模式（Standards Mode）**：浏览器按照 W3C 标准解析和渲染页面
- **怪异模式（Quirks Mode）**：浏览器使用向后兼容的方式渲染页面，模拟老版本浏览器的行为

```html
<!-- HTML5 标准模式 -->
<!DOCTYPE html>

<!-- 如果没有 Doctype 或使用旧的声明，可能触发怪异模式 -->
```

#### (2) 影响盒模型解析
在怪异模式下，盒模型的计算方式与标准模式不同：

```css
/* 标准模式下的盒模型 */
.box {
    width: 100px;
    padding: 10px;
    border: 5px solid black;
    /* 实际宽度 = 100 + 10*2 + 5*2 = 130px */
}

/* 怪异模式下的盒模型（IE 盒模型）*/
.box {
    width: 100px;
    padding: 10px;
    border: 5px solid black;
    /* 实际宽度 = 100px（包含 padding 和 border）*/
}
```

#### (3) 影响 CSS 和 JavaScript 行为
- 某些 CSS 属性的表现会因模式不同而改变
- JavaScript 中的一些方法和属性在不同模式下可能有不同的行为

### 3. 常见的 Doctype 声明

#### HTML5（推荐）
```html
<!DOCTYPE html>
```

#### HTML 4.01 Strict
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

#### HTML 4.01 Transitional
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

#### XHTML 1.0 Strict
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

### 4. 重要性总结

- **确保一致性**：让不同浏览器以相同方式渲染页面
- **避免兼容性问题**：防止因怪异模式导致的布局问题
- **现代开发必需**：HTML5 项目必须使用 `<!DOCTYPE html>` 声明
- **验证基础**：为 HTML 验证工具提供验证依据

正确使用 `<!DOCTYPE>` 声明是现代 Web 开发的基础，能确保网页在各种浏览器中保持一致的表现。
