---
title: Map 和 WeakMap 区别
---

# Map 和 WeakMap 的区别

Map 和 WeakMap 都是 ES6 引入的键值对集合，但它们有重要的区别。下面详细解释它们的差异和使用场景。

## 1. 基本概念

### Map
- 键可以是任何类型的值（对象、原始值）
- 键值对的集合，类似于对象，但键不限于字符串
- 可以迭代，有 `size` 属性

### WeakMap
- 键必须是对象（不能是原始值）
- 键是弱引用，不会阻止垃圾回收
- 不可迭代，没有 `size` 属性

## 2. 键的类型差异

```javascript
// Map 可以使用任何类型的键
const map = new Map();
map.set('string', 'value1');
map.set(1, 'value2');
map.set(true, 'value3');
map.set({}, 'value4');
map.set(function() {}, 'value5');

console.log(map.size); // 5

// WeakMap 只能使用对象作为键
const weakMap = new WeakMap();
const obj1 = {};
const obj2 = {};

weakMap.set(obj1, 'value1');
weakMap.set(obj2, 'value2');

// 以下操作会报错
// weakMap.set('string', 'value'); // TypeError: Invalid value used as weak map key
// weakMap.set(1, 'value');        // TypeError: Invalid value used as weak map key
```

## 3. 垃圾回收机制差异

这是两者最重要的区别：

```javascript
// Map 会阻止对象被垃圾回收
let map = new Map();
let key = {};

map.set(key, 'some value');

// 即使我们将 key 设置为 null，对象仍然存在于内存中
// 因为 Map 保持着对它的引用
key = null;
console.log(map.size); // 1 - 对象仍然存在

// WeakMap 不会阻止对象被垃圾回收
let weakMap = new WeakMap();
let weakKey = {};

weakMap.set(weakKey, 'some value');

// 当我们将 weakKey 设置为 null，对象可以被垃圾回收
weakKey = null;
// 此时对象可能已经被垃圾回收，无法再访问
```

## 4. 可迭代性差异

```javascript
const map = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

const obj1 = {};
const obj2 = {};
const weakMap = new WeakMap([
  [obj1, 'value1'],
  [obj2, 'value2']
]);

// Map 是可迭代的
for (const [key, value] of map) {
  console.log(key, value);
}

console.log([...map]); // [['key1', 'value1'], ['key2', 'value2']]
console.log(map.size); // 2

// WeakMap 不可迭代
// for (const [key, value] of weakMap) {} // TypeError: weakMap is not iterable
// console.log([...weakMap]); // TypeError: weakMap is not iterable
// console.log(weakMap.size); // undefined
```

## 5. 可用方法对比

```javascript
const map = new Map();
const weakMap = new WeakMap();

const obj = {};

// Map 的方法
map.set('key', 'value');
map.get('key');
map.has('key');
map.delete('key');
map.clear();
console.log(map.size);

// WeakMap 的方法 (没有 clear() 和 size)
weakMap.set(obj, 'value');
weakMap.get(obj);
weakMap.has(obj);
weakMap.delete(obj);
// weakMap.clear(); // TypeError: weakMap.clear is not a function
// console.log(weakMap.size); // undefined
```

## 6. 实际应用场景

### Map 的使用场景

```javascript
// 1. 缓存计算结果
const cache = new Map();

function expensiveCalculation(n) {
  if (cache.has(n)) {
    console.log('从缓存获取');
    return cache.get(n);
  }
  
  console.log('执行计算');
  const result = n * n; // 模拟复杂计算
  cache.set(n, result);
  return result;
}

console.log(expensiveCalculation(5)); // 执行计算, 25
console.log(expensiveCalculation(5)); // 从缓存获取, 25

// 2. 统计元素出现次数
function countElements(array) {
  const counts = new Map();
  
  for (const element of array) {
    counts.set(element, (counts.get(element) || 0) + 1);
  }
  
  return counts;
}

const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
console.log(countElements(fruits));
// Map(3) { 'apple' => 3, 'banana' => 2, 'orange' => 1 }

// 3. 存储对象关联数据
const userRoles = new Map();
const user1 = { id: 1, name: 'Alice' };
const user2 = { id: 2, name: 'Bob' };

userRoles.set(user1, 'admin');
userRoles.set(user2, 'user');

console.log(userRoles.get(user1)); // 'admin'
```

### WeakMap 的使用场景

```javascript
// 1. 私有数据存储
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  
  getName() {
    return privateData.get(this).name;
  }
  
  setName(name) {
    privateData.get(this).name = name;
  }
}

const user = new User('Alice');
console.log(user.getName()); // 'Alice'

// 外部无法直接访问私有数据
console.log(privateData); // WeakMap {}

// 2. DOM 元素关联数据
const elementData = new WeakMap();

function attachData(element, data) {
  elementData.set(element, data);
}

function getData(element) {
  return elementData.get(element);
}

const button = document.createElement('button');
attachData(button, { clickCount: 0 });

button.addEventListener('click', () => {
  const data = getData(button);
  data.clickCount++;
  console.log(`按钮被点击了 ${data.clickCount} 次`);
});

// 当 button 元素被移除时，相关数据会自动被垃圾回收

// 3. 对象状态管理
const componentStates = new WeakMap();

class Component {
  constructor() {
    componentStates.set(this, {
      initialized: false,
      rendered: false
    });
  }
  
  initialize() {
    const state = componentStates.get(this);
    state.initialized = true;
    console.log('Component initialized');
  }
  
  isInitialized() {
    return componentStates.get(this).initialized;
  }
}
```

## 7. 性能和内存考虑

```javascript
// 演示内存泄漏问题
function demonstrateMemoryLeak() {
  const map = new Map();
  
  // 创建大量对象并存储在 Map 中
  for (let i = 0; i < 10000; i++) {
    const obj = { id: i, data: new Array(1000).fill('x') };
    map.set(`key${i}`, obj);
    
    // 即使我们不再需要这些对象，它们也不会被垃圾回收
    // 因为 Map 保持着引用
  }
  
  console.log(`Map size: ${map.size}`);
  // 这些对象会一直占用内存直到 Map 被清除
}

// 使用 WeakMap 避免内存泄漏
function demonstrateWeakMap() {
  const weakMap = new WeakMap();
  
  // 创建大量对象并存储在 WeakMap 中
  for (let i = 0; i < 10000; i++) {
    const obj = { id: i, data: new Array(1000).fill('x') };
    weakMap.set(obj, `metadata${i}`);
    
    // 如果 obj 超出作用域且没有其他引用，
    // 它和相关数据都可以被垃圾回收
  }
  
  // 一旦函数执行完毕，所有对象都可以被回收
}
```

## 总结对比表

| 特性 | Map | WeakMap |
|------|-----|---------|
| 键的类型 | 任意类型 | 仅对象 |
| 引用类型 | 强引用 | 弱引用 |
| 可迭代 | 是 | 否 |
| size 属性 | 有 | 无 |
| clear() 方法 | 有 | 无 |
| 内存管理 | 需要手动清理 | 自动垃圾回收 |
| 适用场景 | 缓存、计数、映射 | 私有数据、DOM 数据、避免内存泄漏 |

选择使用 Map 还是 WeakMap 主要取决于你的具体需求：
- 如果需要存储键值对、需要迭代或者键可能是原始类型，使用 Map
- 如果需要存储对象的元数据、避免内存泄漏或者实现私有数据，使用 WeakMap