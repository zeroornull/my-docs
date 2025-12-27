---
title: $(this)和this有什么区别
---

`$(this)` 和 `this` 的主要区别在于它们的类型和可用的方法：

## this
- **类型**：原生JavaScript的DOM元素对象
- **方法**：只能使用原生DOM方法
- **属性**：可以直接访问DOM元素的属性

```javascript
// 原生DOM元素
this.innerHTML = "Hello";
this.setAttribute("class", "new-class");
```

## $(this)
- **类型**：jQuery对象（包装了DOM元素）
- **方法**：可以使用所有jQuery方法
- **链式调用**：支持jQuery的链式调用

```javascript
// jQuery对象
$(this).html("Hello");
$(this).addClass("new-class");
$(this).fadeIn().delay(1000).fadeOut();
```

## 主要区别

### 1. 方法调用能力
- `this`：只能调用原生DOM方法
- `$(this)`：可以调用jQuery方法和原生DOM方法

### 2. 兼容性
- `this`：依赖浏览器原生API，不同浏览器可能有差异
- `$(this)`：jQuery封装，提供跨浏览器兼容性

### 3. 使用场景
```javascript
// 在事件处理函数中
$('.button').click(function() {
    // this 指向原生DOM元素
    console.log(this.id); // 直接访问属性
    
    // $(this) 指向jQuery对象
    $(this).addClass('active').siblings().removeClass('active');
});
```

### 4. 转换关系
```javascript
// this 转换为 jQuery对象
$(this)

// jQuery对象转换为原生DOM元素
$(this)[0] 或 $(this).get(0)
```

## 总结
- 当需要使用jQuery方法时使用 `$(this)`
- 当只需要访问原生DOM属性时可直接使用 `this`
- `$(this)` 提供了更多的功能和更好的兼容性