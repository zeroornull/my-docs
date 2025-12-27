---
title: extend实现原理
---

`jQuery.extend()` 是jQuery中用于对象合并和扩展的核心方法，其实现原理如下：

## 基本实现原理

### 1. 参数处理
```javascript
jQuery.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},  // 目标对象
        i = 1,
        length = arguments.length,
        deep = false;  // 是否深拷贝
```

### 2. 深拷贝判断
```javascript
    // 判断是否为深拷贝
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
```

### 3. 核心合并逻辑
```javascript
    for (; i < length; i++) {
        // 跳过null/undefined参数
        if ((options = arguments[i]) != null) {
            // 遍历源对象的所有属性
            for (name in options) {
                src = target[name];
                copy = options[name];
                
                // 防止无限循环引用
                if (target === copy) {
                    continue;
                }
                
                // 深拷贝处理
                if (deep && copy && (jQuery.isPlainObject(copy) || 
                    (copyIsArray = Array.isArray(copy)))) {
                    
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    
                    // 递归合并
                    target[name] = jQuery.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    // 浅拷贝
                    target[name] = copy;
                }
            }
        }
    }
    
    return target;
};
```

## 使用方式

### 浅拷贝（默认）
```javascript
var obj1 = { a: 1, b: { c: 2 } };
var obj2 = { b: { d: 3 }, e: 4 };
var result = $.extend(obj1, obj2);
// result = { a: 1, b: { d: 3 }, e: 4 }
```

### 深拷贝
```javascript
var obj1 = { a: 1, b: { c: 2 } };
var obj2 = { b: { d: 3 }, e: 4 };
var result = $.extend(true, obj1, obj2);
// result = { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### 扩展jQuery对象
```javascript
$.extend({
    myMethod: function() {
        // 添加静态方法
    }
});
```

### 扩展jQuery实例
```javascript
$.fn.extend({
    myPlugin: function() {
        // 添加实例方法
    }
});
```

## 关键特性

### 1. 循环引用检测
防止对象自我引用导致的无限递归

### 2. 类型判断
区分数组和普通对象，分别处理

### 3. 属性过滤
跳过null和undefined值的处理

### 4. 链式赋值
返回目标对象，支持链式调用

## 实现要点

1. **参数灵活性**：支持可变参数数量
2. **深浅拷贝**：通过第一个参数控制
3. **类型安全**：正确处理数组和对象
4. **性能优化**：避免不必要的操作
5. **兼容性**：处理各种边界情况

这就是`jQuery.extend()`的实现原理，它为jQuery提供了强大的对象扩展和合并能力。