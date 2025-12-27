---
title: Map 和 Set 区别
---

## Map 和 Set 的基本概念

`Map` 和 `Set` 是 ES6 引入的两种新的数据结构，它们提供了比传统对象和数组更强大和灵活的数据存储方式。

## Map 的用法

`Map` 是一种键值对的集合，类似于对象，但键可以是任何类型的值（不仅仅是字符串）。

### 1. 基本操作

```javascript
// 创建 Map
const map = new Map();

// 设置键值对
map.set('name', '张三');
map.set(1, '数字键');
map.set(true, '布尔键');
map.set({}, '对象键');
map.set(function() {}, '函数键');

// 获取值
console.log(map.get('name')); // "张三"
console.log(map.get(1)); // "数字键"

// 检查是否存在某个键
console.log(map.has('name')); // true

// 删除键值对
map.delete('name');
console.log(map.has('name')); // false

// 获取大小
console.log(map.size); // 4

// 清空所有键值对
// map.clear();
```

### 2. 初始化 Map

```javascript
// 使用数组初始化
const map1 = new Map([
    ['name', '李四'],
    ['age', 25],
    [1, 'one'],
    [true, 'yes']
]);

console.log(map1.get('name')); // "李四"
console.log(map1.size); // 4

// 从对象创建 Map
const obj = { a: 1, b: 2, c: 3 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('a')); // 1
```

### 3. 遍历 Map

```javascript
const map = new Map([
    ['name', '王五'],
    ['age', 30],
    ['job', '工程师']
]);

// 使用 forEach
map.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});
// 输出:
// name: 王五
// age: 30
// job: 工程师

// 使用 for...of
for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}

// 获取所有键
for (const key of map.keys()) {
    console.log(key);
}

// 获取所有值
for (const value of map.values()) {
    console.log(value);
}

// 转换为数组
console.log([...map]); // [['name', '王五'], ['age', 30], ['job', '工程师']]
console.log([...map.keys()]); // ['name', 'age', 'job']
console.log([...map.values()]); // ['王五', 30, '工程师']
```

### 4. Map 的实际应用

```javascript
// 缓存系统
class Cache {
    constructor() {
        this.data = new Map();
        this.timestamps = new Map();
    }
    
    set(key, value, ttl = 60000) { // 默认1分钟过期
        this.data.set(key, value);
        this.timestamps.set(key, Date.now() + ttl);
    }
    
    get(key) {
        if (!this.data.has(key)) {
            return undefined;
        }
        
        if (Date.now() > this.timestamps.get(key)) {
            // 过期了，删除
            this.data.delete(key);
            this.timestamps.delete(key);
            return undefined;
        }
        
        return this.data.get(key);
    }
}

// 私有属性模拟
const privateData = new Map();

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
```

## Set 的用法

`Set` 是一种值的集合，其中每个值只能出现一次（唯一性）。

### 1. 基本操作

```javascript
// 创建 Set
const set = new Set();

// 添加值
set.add(1);
set.add(2);
set.add(2); // 重复值不会被添加
set.add('hello');
set.add({});

console.log(set.size); // 4

// 检查是否存在某个值
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// 删除值
set.delete(1);
console.log(set.has(1)); // false

// 清空所有值
// set.clear();
```

### 2. 初始化 Set

```javascript
// 使用数组初始化
const set1 = new Set([1, 2, 3, 4, 4, 5]);
console.log(set1); // Set { 1, 2, 3, 4, 5 }

// 字符串初始化
const set2 = new Set('hello');
console.log(set2); // Set { 'h', 'e', 'l', 'o' }

// 从数组去重
const numbers = [1, 2, 2, 3, 3, 4, 5, 5];
const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]
```

### 3. 遍历 Set

```javascript
const set = new Set(['apple', 'banana', 'orange']);

// 使用 forEach
set.forEach(value => {
    console.log(value);
});

// 使用 for...of
for (const value of set) {
    console.log(value);
}

// 转换为数组
console.log([...set]); // ['apple', 'banana', 'orange']
```

### 4. Set 的集合操作

```javascript
// 并集
function union(setA, setB) {
    return new Set([...setA, ...setB]);
}

// 交集
function intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

// 差集
function difference(setA, setB) {
    return new Set([...setA].filter(x => !setB.has(x)));
}

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

console.log(union(setA, setB)); // Set { 1, 2, 3, 4, 5, 6 }
console.log(intersection(setA, setB)); // Set { 3, 4 }
console.log(difference(setA, setB)); // Set { 1, 2 }
```

### 5. Set 的实际应用

```javascript
// 数组去重
function removeDuplicates(array) {
    return [...new Set(array)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 4])); // [1, 2, 3, 4]

// 过滤重复的DOM元素
function getUniqueElements(elements) {
    return [...new Set(elements)];
}

// 跟踪已访问的项目
class VisitorTracker {
    constructor() {
        this.visited = new Set();
    }
    
    visit(item) {
        if (this.visited.has(item)) {
            return false; // 已访问过
        }
        this.visited.add(item);
        return true; // 首次访问
    }
    
    getVisitedCount() {
        return this.visited.size;
    }
}

// 标签系统
class TagManager {
    constructor() {
        this.tags = new Set();
    }
    
    addTag(tag) {
        this.tags.add(tag.toLowerCase());
    }
    
    removeTag(tag) {
        this.tags.delete(tag.toLowerCase());
    }
    
    hasTag(tag) {
        return this.tags.has(tag.toLowerCase());
    }
    
    getAllTags() {
        return [...this.tags];
    }
}
```

## Map 和 Set 的主要区别

| 特性 | Map | Set |
|------|-----|-----|
| 数据结构 | 键值对集合 | 值的集合 |
| 键的类型 | 任何类型 | 无键，只有值 |
| 重复性 | 键不能重复 | 值不能重复 |
| 访问方式 | `get(key)` / `set(key, value)` | `add(value)` / `has(value)` |
| 大小获取 | `size` 属性 | `size` 属性 |
| 遍历方式 | `forEach((value, key) => {})` | `forEach(value => {})` |

### 性能对比示例

```javascript
// 在大量数据中查找性能对比

// 使用 Object
const obj = {};
for (let i = 0; i < 100000; i++) {
    obj[`key${i}`] = i;
}

console.time('Object lookup');
console.log(obj['key50000'] !== undefined);
console.timeEnd('Object lookup');

// 使用 Map
const map = new Map();
for (let i = 0; i < 100000; i++) {
    map.set(`key${i}`, i);
}

console.time('Map lookup');
console.log(map.has('key50000'));
console.timeEnd('Map lookup');

// 使用 Array (线性查找)
const arr = [];
for (let i = 0; i < 100000; i++) {
    arr.push({ key: `key${i}`, value: i });
}

console.time('Array lookup');
console.log(arr.find(item => item.key === 'key50000') !== undefined);
console.timeEnd('Array lookup');

// 去重性能对比

// 使用 Array.indexOf
const numbers1 = Array.from({length: 10000}, () => Math.floor(Math.random() * 1000));
console.time('Array deduplication');
const unique1 = numbers1.filter((item, index) => numbers1.indexOf(item) === index);
console.timeEnd('Array deduplication');

// 使用 Set
const numbers2 = Array.from({length: 10000}, () => Math.floor(Math.random() * 1000));
console.time('Set deduplication');
const unique2 = [...new Set(numbers2)];
console.timeEnd('Set deduplication');
```

## 何时使用 Map 和 Set

### 使用 Map 的场景：
1. 需要使用非字符串/数字作为键
2. 需要频繁添加/删除键值对
3. 需要保持插入顺序
4. 键的类型不确定或会变化

### 使用 Set 的场景：
1. 需要去重
2. 需要检查元素是否存在
3. 实现数学集合操作
4. 跟踪唯一值

`Map` 和 `Set` 为 JavaScript 提供了更强大和语义化的数据结构，合理使用它们可以让代码更加清晰和高效。