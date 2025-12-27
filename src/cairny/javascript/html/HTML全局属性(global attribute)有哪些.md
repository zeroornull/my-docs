---
title: HTML全局属性(global attribute)有哪些
---


HTML全局属性（Global Attributes）是所有HTML元素都可以使用的属性，无论元素的类型如何。以下是对HTML全局属性的详细讲解：

## 1. 核心全局属性

### id 属性
- 用于唯一标识文档中的元素
- 在整个HTML文档中必须唯一
- 常用于CSS选择器和JavaScript操作

### `class` 属性
- 用于指定元素的类名
- 可以为元素指定多个类，用空格分隔
- 主要用于CSS样式和JavaScript操作

### `style` 属性
- 用于为元素添加内联CSS样式
- 直接在元素上定义样式规则

### title 属性
- 为元素提供额外信息
- 通常以工具提示的形式显示

## 2. 语言和文本相关属性

### lang 属性
- 指定元素内容的语言
- 例如：`lang="zh-CN"`表示简体中文

### `dir` 属性
- 指定文本方向
- 可选值：`ltr`（从左到右）、`rtl`（从右到左）、`auto`（自动检测）

### `translate` 属性
- 指定元素内容是否应该被翻译
- 可选值：`yes`或`no`

## 3. 可访问性属性

### `tabindex` 属性
- 控制元素是否可以获取焦点以及获取焦点的顺序
- 值为数字，负值表示不可通过Tab键访问，0表示可访问，正值表示访问顺序

### `accesskey` 属性
- 定义激活元素的快捷键
- 用户可以通过特定键组合快速访问元素

### `contenteditable` 属性
- 指定元素内容是否可编辑
- 可选值：`true`、`false`、`inherit`

### `spellcheck` 属性
- 指定是否对元素内容进行拼写检查
- 可选值：`true`或`false`

## 4. 数据属性

### `data-*` 属性
- 允许在HTML元素上存储自定义数据
- 属性名以`data-`开头，后面跟小写连字符分隔的名称
- 可以通过JavaScript的`dataset` API访问

```html
<div data-user-id="123" data-role="admin">用户信息</div>
```

## 5. 拖放相关属性

### `draggable` 属性
- 指定元素是否可拖动
- 可选值：`true`、`false`、`auto`

### `dropzone` 属性
- 指定元素是否为拖放目标
- 可选值：`copy`、`move`、`link`

## 6. 其他重要属性

### hidden 属性
- 指定元素是否隐藏
- 是布尔属性，存在即表示隐藏

### `itemid`、`itemprop`、`itemref`、`itemscope`、`itemtype` 属性
- 用于微数据（Microdata），提供结构化数据

### `role` 和 `aria-*` 属性
- 用于增强可访问性
- 定义元素的角色和状态信息

## 使用示例

```html
<div id="main-content" 
     class="container primary" 
     lang="zh-CN" 
     dir="ltr"
     title="主要内容区域"
     tabindex="0"
     contenteditable="false"
     data-section="introduction"
     hidden>
  这是一个示例内容
</div>
```

这些全局属性为HTML元素提供了丰富的功能和语义信息，有助于创建更具语义化、可访问性和交互性的网页。