---
title: Node.is理解
---

## Node.js 中的 `util.is*` 方法详解

在 Node.js 中，`util` 模块提供了一系列实用工具函数，其中包括一系列 is* 方法，用于类型检查和对象验证。

### 什么是 `util.is*` 方法？

`util.is*` 方法是一组用于检查 JavaScript 值类型的函数，它们可以帮助开发者准确判断变量的类型，避免 JavaScript 中类型检查的陷阱。

### 常用的 `util.is*` 方法

```javascript
const util = require('util');

// 1. util.isArray(object)
console.log(util.isArray([]));        // true
console.log(util.isArray({}));        // false
console.log(util.isArray('array'));   // false

// 2. util.isBoolean(object)
console.log(util.isBoolean(true));    // true
console.log(util.isBoolean(false));   // true
console.log(util.isBoolean('true'));  // false

// 3. util.isNull(object)
console.log(util.isNull(null));       // true
console.log(util.isNull(undefined));  // false

// 4. util.isNullOrUndefined(object)
console.log(util.isNullOrUndefined(null));       // true
console.log(util.isNullOrUndefined(undefined));  // true
console.log(util.isNullOrUndefined(0));          // false

// 5. util.isNumber(object)
console.log(util.isNumber(42));       // true
console.log(util.isNumber('42'));     // false
console.log(util.isNumber(NaN));      // true
console.log(util.isNumber(Infinity)); // true

// 6. util.isString(object)
console.log(util.isString('hello'));  // true
console.log(util.isString(123));      // false

// 7. util.isSymbol(object)
console.log(util.isSymbol(Symbol('test'))); // true
console.log(util.isSymbol('symbol'));       // false

// 8. util.isUndefined(object)
console.log(util.isUndefined(undefined)); // true
console.log(util.isUndefined(null));      // false

// 9. util.isRegExp(object)
console.log(util.isRegExp(/abc/));    // true
console.log(util.isRegExp('/abc/'));  // false

// 10. util.isObject(object)
console.log(util.isObject({}));       // true
console.log(util.isObject([]));       // true (数组也是对象)
console.log(util.isObject(null));     // false

// 11. util.isDate(object)
console.log(util.isDate(new Date())); // true
console.log(util.isDate(Date.now())); // false

// 12. util.isError(object)
console.log(util.isError(new Error()));     // true
console.log(util.isError(new TypeError())); // true

// 13. util.isFunction(object)
console.log(util.isFunction(() => {}));     // true
console.log(util.isFunction(function(){})); // true
console.log(util.isFunction(class {}));     // true

// 14. util.isPrimitive(object)
console.log(util.isPrimitive(123));     // true
console.log(util.isPrimitive('hello')); // true
console.log(util.isPrimitive({}));      // false
console.log(util.isPrimitive([]));      // false
```

### 优点

#### 1. 准确性
```javascript
// JavaScript 中 typeof 的陷阱
console.log(typeof null);        // "object" (这是一个历史bug)
console.log(typeof []);          // "object"
console.log(typeof new Date());  // "object"

// util.is* 方法更加准确
const util = require('util');
console.log(util.isNull(null));  // true
console.log(util.isArray([]));   // true
console.log(util.isDate(new Date())); // true
```

#### 2. 一致性
```javascript
// 所有方法遵循一致的命名和使用方式
const testValues = [null, undefined, [], {}, new Date(), /regex/];

testValues.forEach(value => {
  console.log(`${value}: isArray=${util.isArray(value)}, isObject=${util.isObject(value)}`);
});
```

#### 3. 简洁性
```javascript
// 使用 util.is* 比手动检查更简洁
function processData(data) {
  if (util.isArray(data)) {
    return data.map(item => processItem(item));
  } else if (util.isObject(data)) {
    return Object.keys(data).map(key => processItem(data[key]));
  } else {
    throw new Error('Invalid data type');
  }
}
```

### 缺点

#### 1. 已废弃 (Deprecated)
```javascript
// 从 Node.js v4.0.0 开始，所有 util.is* 方法都被标记为废弃
// 官方建议使用其他替代方案
console.log('util.isArray is deprecated'); // 控制台会有废弃警告
```

#### 2. 功能有限
```javascript
// util.is* 方法只能检查基本类型，无法检查复杂类型
class MyClass {}
const instance = new MyClass();

console.log(util.isObject(instance)); // true，但无法知道是 MyClass 实例
```

#### 3. 性能考虑
```javascript
// 在某些情况下，原生方法可能更快
// 但差异通常可以忽略不计
```

### 现代替代方案

由于 `util.is*` 方法已被废弃，现在推荐使用以下替代方案：

#### 1. 使用 `Array.isArray()`
```javascript
// 推荐替代 util.isArray()
console.log(Array.isArray([]));     // true
console.log(Array.isArray({}));     // false
```

#### 2. 使用 `instanceof`
```javascript
// 推荐替代 util.isDate(), util.isRegExp(), util.isError() 等
console.log(new Date() instanceof Date);    // true
console.log(/abc/ instanceof RegExp);       // true
console.log(new Error() instanceof Error);  // true
```

#### 3. 使用 `typeof` 结合额外检查
```javascript
// 替代 util.isNull(), util.isUndefined() 等
function isNull(value) {
  return value === null;
}

function isUndefined(value) {
  return value === undefined;
}

function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

#### 4. 使用 Lodash 等工具库
```javascript
const _ = require('lodash');

console.log(_.isArray([]));     // true
console.log(_.isDate(new Date())); // true
console.log(_.isError(new Error())); // true
console.log(_.isFunction(() => {})); // true
```

### 应用场景

#### 1. 参数验证
```javascript
function calculateAverage(numbers) {
  // 在废弃前的写法
  // if (!util.isArray(numbers)) {
  //   throw new TypeError('Expected an array');
  // }
  
  // 现代写法
  if (!Array.isArray(numbers)) {
    throw new TypeError('Expected an array');
  }
  
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => {
    if (typeof num !== 'number') {
      throw new TypeError('All elements must be numbers');
    }
    return acc + num;
  }, 0);
  
  return sum / numbers.length;
}
```

#### 2. 类型安全的工具函数
```javascript
// 类型检查工具函数
function deepClone(obj) {
  // 在废弃前的写法
  // if (util.isNull(obj) || util.isUndefined(obj)) {
  //   return obj;
  // }
  
  // 现代写法
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}
```

#### 3. 日志和调试工具
```javascript
function formatLogData(data) {
  if (Array.isArray(data)) {
    return `Array[${data.length}]: ${JSON.stringify(data.slice(0, 3))}${data.length > 3 ? '...' : ''}`;
  }
  
  if (data instanceof Date) {
    return `Date: ${data.toISOString()}`;
  }
  
  if (data instanceof Error) {
    return `Error: ${data.message} (${data.stack})`;
  }
  
  if (typeof data === 'object' && data !== null) {
    return `Object: ${JSON.stringify(data)}`;
  }
  
  return String(data);
}
```

### 总结

虽然 `util.is*` 方法在早期 Node.js 版本中很有用，但它们已经被废弃，主要原因是：

1. **更好的原生替代方案**：ES5/ES6 提供了更标准的类型检查方法
2. **功能局限性**：只能检查基本类型，无法满足复杂需求
3. **维护成本**：Node.js 团队决定专注于更核心的功能

现代开发中，建议使用：
- `Array.isArray()` 替代 `util.isArray()`
- `instanceof` 替代 `util.isDate()`, `util.isRegExp()` 等
- `typeof` 结合适当的值检查替代其他方法
- 第三方库如 Lodash 提供更全面的类型检查功能

这样可以确保代码的现代性和兼容性，同时避免使用已废弃的 API。