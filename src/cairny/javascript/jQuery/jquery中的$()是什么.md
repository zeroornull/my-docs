---
title: jquery中的$()是什么
---

jQuery中的`$()`是jQuery库的核心函数，也称为jQuery工厂函数或选择器函数。

## 基本概念
- **名称**：`$`是jQuery的别名，`$()`等同于`jQuery()`
- **作用**：用于选择DOM元素并创建jQuery对象
- **返回值**：返回一个jQuery对象，包含选中的元素集合

## 主要功能

### 1. 选择DOM元素
```javascript
// 通过CSS选择器选择元素
$('div')           // 选择所有div元素
$('#myId')         // 选择id为myId的元素
$('.myClass')      // 选择class为myClass的元素
$('div.class')     // 选择同时满足多个条件的元素
```

### 2. 创建新元素
```javascript
// 创建新的DOM元素
$('<div>Hello</div>')     // 创建一个div元素
$('<p>', {text: 'Hello'}) // 创建p元素并设置属性
```

### 3. 包装DOM元素
```javascript
// 包装原生DOM元素
$(document)        // 包装document对象
$(this)            // 包装当前DOM元素
```

### 4. 执行函数
```javascript
// DOM加载完成后执行
$(function() {
    // 相当于 $(document).ready()
});
```

## 常见用法

### 选择器语法
```javascript
$('selector')                    // 基本选择器
$('selector', context)           // 指定上下文的选择器
$('#id .class:first-child')      // 复杂选择器
```

### 方法链
```javascript
$('#myElement')
    .addClass('active')
    .fadeIn()
    .click(function() {
        // 链式调用jQuery方法
    });
```

## 核心特点
1. **统一接口**：提供一致的API来操作不同类型的元素
2. **链式调用**：大多数jQuery方法返回jQuery对象，支持链式操作
3. **隐式迭代**：自动对集合中所有元素执行操作
4. **跨浏览器兼容**：封装浏览器差异，提供统一行为

`$()`是使用jQuery的入口，几乎所有jQuery操作都从这个函数开始。