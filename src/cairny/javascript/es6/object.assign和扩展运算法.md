---
title: object.assign和扩展运算法
---

# Object.assign 和扩展运算符是深拷贝还是浅拷贝？

`Object.assign()` 和扩展运算符（spread operator）都执行**浅拷贝**（shallow copy），而不是深拷贝（deep copy）。下面我们详细解释它们的区别和用法。

## 1. 浅拷贝 vs 深拷贝

### 浅拷贝（Shallow Copy）
- 只复制对象的第一层属性
- 对于嵌套对象，复制的是引用而不是值
- 修改嵌套对象会影响原对象

### 深拷贝（Deep Copy）
- 递归复制对象的所有层级
- 创建完全独立的对象副本
- 修改副本不会影响原对象

## 2. Object.assign 浅拷贝演示

```javascript
// 基本类型属性的拷贝
const source1 = { a: 1, b: 2, c: 3 };
const target1 = Object.assign({}, source1);

console.log(target1); // { a: 1, b: 2, c: 3 }
target1.a = 10;
console.log(source1.a); // 1 (未改变)
console.log(target1.a); // 10 (已改变)

// 嵌套对象的浅拷贝问题
const source2 = {
  name: 'Alice',
  age: 25,
  address: {
    city: 'Beijing',
    street: 'Main St'
  },
  hobbies: ['reading', 'swimming']
};

const target2 = Object.assign({}, source2);

// 修改基本属性
target2.name = 'Bob';
console.log(source2.name); // Alice (未改变)
console.log(target2.name); // Bob (已改变)

// 修改嵌套对象
target2.address.city = 'Shanghai';
console.log(source2.address.city); // Shanghai (原对象也被改变了！)
console.log(target2.address.city); // Shanghai

// 修改数组
target2.hobbies.push('coding');
console.log(source2.hobbies); // ['reading', 'swimming', 'coding'] (原对象也被改变了！)
console.log(target2.hobbies); // ['reading', 'swimming', 'coding']
```

## 3. 扩展运算符浅拷贝演示

```javascript
// 基本用法
const source1 = { a: 1, b: 2, c: 3 };
const target1 = { ...source1 };

console.log(target1); // { a: 1, b: 2, c: 3 }
target1.a = 10;
console.log(source1.a); // 1
console.log(target1.a); // 10

// 嵌套对象的浅拷贝问题
const source2 = {
  name: 'Charlie',
  details: {
    age: 30,
    job: 'Developer'
  }
};

const target2 = { ...source2 };

target2.details.age = 35;
console.log(source2.details.age); // 35 (原对象也被改变了！)
console.log(target2.details.age); // 35

// 数组合并
const arr1 = [1, 2, { nested: 'value' }];
const arr2 = [...arr1];

arr2[2].nested = 'changed';
console.log(arr1[2].nested); // 'changed' (原数组也被改变了！)
console.log(arr2[2].nested); // 'changed'
```

## 4. 两者的基本区别

### 语法差异

```javascript
// Object.assign
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged1 = Object.assign({}, obj1, obj2);

// 扩展运算符
const merged2 = { ...obj1, ...obj2 };

console.log(merged1); // { a: 1, b: 2, c: 3, d: 4 }
console.log(merged2); // { a: 1, b: 2, c: 3, d: 4 }
```

### 处理多个源对象

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 }; // b 属性会覆盖
const obj3 = { c: 5, d: 6 }; // c 属性会覆盖

// Object.assign
const result1 = Object.assign({}, obj1, obj2, obj3);
console.log(result1); // { a: 1, b: 3, c: 5, d: 6 }

// 扩展运算符
const result2 = { ...obj1, ...obj2, ...obj3 };
console.log(result2); // { a: 1, b: 3, c: 5, d: 6 }
```

### 性能差异

```javascript
// 性能测试示例
const largeObject = {};
for (let i = 0; i < 10000; i++) {
  largeObject[`key${i}`] = i;
}

console.time('Object.assign');
const copy1 = Object.assign({}, largeObject);
console.timeEnd('Object.assign');

console.time('Spread operator');
const copy2 = { ...largeObject };
console.timeEnd('Spread operator');
```

## 5. 实际应用场景

### 合并配置对象

```javascript
// 默认配置
const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  ssl: false
};

// 用户配置
const userConfig = {
  port: 8080,
  ssl: true
};

// 合并配置（浅拷贝）
const finalConfig = { ...defaultConfig, ...userConfig };
console.log(finalConfig);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### React 中的状态更新

```javascript
class Component {
  constructor() {
    this.state = {
      user: {
        name: 'Alice',
        profile: {
          avatar: 'default.jpg',
          theme: 'light'
        }
      },
      posts: [1, 2, 3]
    };
  }
  
  // 错误的状态更新方式（浅拷贝问题）
  updateUserWrong(newName) {
    const newState = { ...this.state };
    newState.user.name = newName; // 这会修改原状态！
    this.state = newState;
  }
  
  // 正确的状态更新方式
  updateUserCorrect(newName) {
    const newState = {
      ...this.state,
      user: {
        ...this.state.user,
        name: newName
      }
    };
    this.state = newState;
  }
}
```

## 6. 实现深拷贝的方法

### 使用 JSON 方法（有限制）

```javascript
const source = {
  name: 'Alice',
  age: 25,
  address: {
    city: 'Beijing'
  },
  date: new Date(),
  func: function() { return 'hello'; }
};

// JSON 方法实现深拷贝（有局限性）
const deepCopyJSON = JSON.parse(JSON.stringify(source));

console.log(deepCopyJSON);
// 问题：函数、undefined、Symbol、Date 等特殊类型会丢失或转换

console.log(source.date instanceof Date);      // true
console.log(deepCopyJSON.date instanceof Date); // false (变成了字符串)
console.log(deepCopyJSON.func);                // undefined
```

### 自定义深拷贝函数

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // 处理 null 和非对象类型
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);
  
  // 处理日期对象
  if (obj instanceof Date) return new Date(obj);
  
  // 处理正则表达式
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 处理数组和对象
  const clonedObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, clonedObj);
  
  // 递归克隆所有属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], hash);
    }
  }
  
  return clonedObj;
}

// 测试深拷贝
const original = {
  name: 'Bob',
  details: {
    age: 30,
    address: {
      city: 'Shanghai'
    }
  },
  hobbies: ['reading', 'coding'],
  date: new Date(),
  regex: /test/g
};

const deepCopied = deepClone(original);

// 修改深拷贝后的对象
deepCopied.details.address.city = 'Beijing';
deepCopied.hobbies.push('swimming');

console.log(original.details.address.city); // Shanghai (未改变)
console.log(deepCopied.details.address.city); // Beijing (已改变)
console.log(original.hobbies.length); // 2
console.log(deepCopied.hobbies.length); // 3
```

### 使用 Lodash 库

```javascript
// 需要先安装 lodash: npm install lodash
// const _ = require('lodash'); // Node.js
// import _ from 'lodash'; // ES6 modules

const original = {
  name: 'Charlie',
  details: {
    age: 25,
    skills: ['JavaScript', 'React']
  }
};

// 使用 lodash 的深拷贝
// const deepCopied = _.cloneDeep(original);

// 修改示例（注释掉因为需要 lodash 库）
// deepCopied.details.skills.push('Vue');
// console.log(original.details.skills); // ['JavaScript', 'React']
// console.log(deepCopied.details.skills); // ['JavaScript', 'React', 'Vue']
```

## 7. 最佳实践

### 何时使用浅拷贝

```javascript
// 1. 简单对象，没有嵌套
const simpleConfig = { theme: 'dark', lang: 'en' };
const userConfig = { lang: 'zh' };
const finalConfig = { ...simpleConfig, ...userConfig };

// 2. 需要替换整个嵌套对象
const state = {
  user: { name: 'Alice', id: 1 },
  ui: { theme: 'light' }
};

const newState = {
  ...state,
  user: { name: 'Bob', id: 2 } // 完全替换 user 对象
};
```

### 何时需要深拷贝

```javascript
// 1. 复杂嵌套对象需要独立修改
const originalData = {
  users: [
    { id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
    { id: 2, profile: { name: 'Bob', settings: { theme: 'light' } } }
  ]
};

// 需要深拷贝来安全修改
function updateTheme(data, userId, newTheme) {
  // 这里需要深拷贝实现
  const newData = deepClone(data);
  const user = newData.users.find(u => u.id === userId);
  if (user) {
    user.profile.settings.theme = newTheme;
  }
  return newData;
}

// 2. 缓存复杂对象
const cache = new Map();

function getCachedData(key, originalObject) {
  if (cache.has(key)) {
    // 返回深拷贝，避免缓存被意外修改
    return deepClone(cache.get(key));
  }
  
  cache.set(key, originalObject);
  return deepClone(originalObject);
}
```

## 总结

| 特性 | Object.assign | 扩展运算符 | 深拷贝 |
|------|---------------|------------|--------|
| 拷贝类型 | 浅拷贝 | 浅拷贝 | 深拷贝 |
| 语法 | `Object.assign({}, obj1, obj2)` | `{ ...obj1, ...obj2 }` | 需要自定义实现 |
| 性能 | 中等 | 较快 | 较慢 |
| 嵌套对象 | 引用拷贝 | 引用拷贝 | 值拷贝 |
| 使用场景 | 兼容性要求高 | 现代 JavaScript | 需要完全独立副本 |

选择使用哪种方法取决于具体需求：
- **简单对象合并**：使用扩展运算符或 `Object.assign`
- **需要保持原对象不变**：对于嵌套对象需要手动深拷贝或使用工具库
- **性能敏感场景**：扩展运算符通常性能更好