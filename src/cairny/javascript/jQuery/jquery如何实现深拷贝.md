---
title: jquery如何实现深拷贝
---

jQuery通过`$.extend()`方法实现深拷贝功能，以下是其实现方式和使用方法：

## 使用方法

### 基本深拷贝语法
```javascript
var newObj = $.extend(true, {}, originalObj);
```

## 实现原理

### 1. 深拷贝标识
```javascript
// 第一个参数为true表示深拷贝
$.extend(true, target, object1, object2, ...);
```

### 2. 递归处理对象和数组
```javascript
// 核心逻辑（简化版）
if (deep && copy && (jQuery.isPlainObject(copy) || Array.isArray(copy))) {
    // 处理数组
    if (Array.isArray(copy)) {
        clone = Array.isArray(src) ? src : [];
    } 
    // 处理对象
    else {
        clone = jQuery.isPlainObject(src) ? src : {};
    }
    
    // 递归调用
    target[name] = jQuery.extend(deep, clone, copy);
}
```

## 实际应用示例

### 深拷贝对象
```javascript
var original = {
    name: "John",
    details: {
        age: 30,
        address: {
            city: "New York",
            zip: "10001"
        }
    },
    hobbies: ["reading", "swimming"]
};

// 深拷贝
var copied = $.extend(true, {}, original);

// 修改拷贝对象不会影响原对象
copied.details.age = 31;
copied.details.address.city = "Boston";
copied.hobbies.push("coding");

console.log(original.details.age); // 30 (未改变)
console.log(original.details.address.city); // "New York" (未改变)
console.log(original.hobbies.length); // 2 (未改变)
```

### 多对象深拷贝
```javascript
var obj1 = { a: 1, nested: { x: 10 } };
var obj2 = { b: 2, nested: { y: 20 } };
var obj3 = { c: 3, nested: { z: 30 } };

var merged = $.extend(true, {}, obj1, obj2, obj3);
// 结果: { a: 1, b: 2, c: 3, nested: { x: 10, y: 20, z: 30 } }
```

## 与其他深拷贝方法的比较

### jQuery深拷贝 vs JSON方法
```javascript
// JSON方法的局限性
var obj = {
    func: function() {},
    date: new Date(),
    undef: undefined
};

// JSON方法会丢失函数、日期类型变为字符串、undefined被忽略
var jsonCopy = JSON.parse(JSON.stringify(obj));

// jQuery深拷贝保持数据类型
var jqueryCopy = $.extend(true, {}, obj);
```

### jQuery深拷贝 vs 自定义递归
```javascript
// jQuery内部处理了各种边界情况
// 包括循环引用检测、特殊对象处理等
```

## 注意事项

### 1. 性能考虑
```javascript
// 深拷贝比浅拷贝消耗更多性能
// 只在必要时使用深拷贝
var shallow = $.extend({}, original);     // 浅拷贝
var deep = $.extend(true, {}, original);  // 深拷贝
```

### 2. 循环引用处理
```javascript
// jQuery会检测并处理循环引用
var obj = { a: 1 };
obj.self = obj; // 循环引用

// jQuery会正确处理这种情况
var copy = $.extend(true, {}, obj);
```

### 3. 特殊对象限制
```javascript
// 某些特殊对象可能无法完美深拷贝
var special = {
    dom: document.createElement('div'),
    jquery: $('#element'),
    regexp: /test/g
};

// 这些对象的深拷贝可能不会完全按预期工作
```

## 总结

jQuery的深拷贝实现通过：
1. **递归遍历**：深入对象和数组的每个层级
2. **类型判断**：区分处理对象和数组
3. **循环引用检测**：防止无限递归
4. **保持引用关系**：在拷贝结构中保持原有的引用关系

这种方式为开发者提供了简单易用的深拷贝功能，是jQuery的重要特性之一。