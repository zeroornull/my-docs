---
title: ES6中数组新增的扩展
---

## ES6 中数组的新增扩展

ES6 为 JavaScript 数组带来了许多强大的新方法和特性，使数组操作更加便捷和高效。

## 1. Array.from()

```javascript
// 从类数组对象创建数组
const arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
};

const arr1 = Array.from(arrayLike);
console.log(arr1); // ['a', 'b', 'c']

// 从可迭代对象创建数组
const set = new Set([1, 2, 3, 2, 1]);
const arr2 = Array.from(set);
console.log(arr2); // [1, 2, 3]

// 从字符串创建数组
const str = 'hello';
const arr3 = Array.from(str);
console.log(arr3); // ['h', 'e', 'l', 'l', 'o']

// 使用映射函数
const arr4 = Array.from([1, 2, 3], x => x * x);
console.log(arr4); // [1, 4, 9]

// 创建指定长度的数组并初始化
const arr5 = Array.from({ length: 5 }, (_, index) => index);
console.log(arr5); // [0, 1, 2, 3, 4]

// 实用示例：生成范围数组
function range(start, end, step = 1) {
    return Array.from(
        { length: Math.ceil((end - start) / step) },
        (_, index) => start + index * step
    );
}

console.log(range(1, 10, 2)); // [1, 3, 5, 7, 9]
```

## 2. Array.of()

```javascript
// 创建数组，避免构造函数的歧义
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of(3)); // [3] (而不是长度为3的空数组)
console.log(Array.of()); // []

// 与 Array() 构造函数的区别
console.log(Array(3)); // [, , ,] (长度为3的空数组)
console.log(Array(1, 2, 3)); // [1, 2, 3]
```

## 3. 扩展运算符（Spread Operator）

```javascript
// 数组合并
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 数组复制（浅拷贝）
const original = [1, 2, 3];
const copy = [...original];
console.log(copy); // [1, 2, 3]

// 将 NodeList 转换为数组
// const divs = [...document.querySelectorAll('div')];

// 与数组方法结合使用
const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = [...numbers].sort((a, b) => a - b);
console.log(sorted); // [1, 1, 2, 3, 4, 5, 6, 9]
console.log(numbers); // 原数组不变 [3, 1, 4, 1, 5, 9, 2, 6]
```

## 4. find() 和 findIndex()

```javascript
const users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 }
];

// find() - 查找第一个满足条件的元素
const user = users.find(u => u.age > 26);
console.log(user); // { id: 2, name: '李四', age: 30 }

// findIndex() - 查找第一个满足条件的元素索引
const index = users.findIndex(u => u.name === '王五');
console.log(index); // 2

// 实际应用：查找用户
function findUserById(users, id) {
    return users.find(user => user.id === id);
}

function findUserIndexById(users, id) {
    return users.findIndex(user => user.id === id);
}

const foundUser = findUserById(users, 2);
console.log(foundUser); // { id: 2, name: '李四', age: 30 }
```

## 5. fill()

```javascript
// 填充数组
const arr1 = new Array(5).fill(0);
console.log(arr1); // [0, 0, 0, 0, 0]

// 指定范围填充
const arr2 = [1, 2, 3, 4, 5];
arr2.fill(0, 1, 4); // 从索引1到4（不包括4）填充0
console.log(arr2); // [1, 0, 0, 0, 5]

// 填充对象（注意引用问题）
const arr3 = new Array(3).fill({});
arr3[0].name = '张三';
console.log(arr3); // [{ name: '张三' }, { name: '张三' }, { name: '张三' }]

// 正确的填充对象方式
const arr4 = Array.from({ length: 3 }, () => ({}));
arr4[0].name = '张三';
console.log(arr4); // [{ name: '张三' }, {}, {}]
```

## 6. copyWithin()

```javascript
// 复制数组的一部分到同一数组的另一个位置
const arr = [1, 2, 3, 4, 5];

// copyWithin(target, start, end)
arr.copyWithin(0, 3); // 从索引3开始复制到索引0
console.log(arr); // [4, 5, 3, 4, 5]

const arr2 = [1, 2, 3, 4, 5];
arr2.copyWithin(0, 3, 4); // 从索引3到4复制到索引0
console.log(arr2); // [4, 2, 3, 4, 5]

const arr3 = [1, 2, 3, 4, 5];
arr3.copyWithin(-2, -3, -1); // 负索引支持
console.log(arr3); // [1, 2, 3, 3, 4]
```

## 7. entries(), keys(), values()

```javascript
const fruits = ['apple', 'banana', 'orange'];

// entries() - 返回键值对迭代器
for (const [index, value] of fruits.entries()) {
    console.log(`${index}: ${value}`);
}
// 0: apple
// 1: banana
// 2: orange

// keys() - 返回键迭代器
for (const key of fruits.keys()) {
    console.log(key);
}
// 0
// 1
// 2

// values() - 返回值迭代器
for (const value of fruits.values()) {
    console.log(value);
}
// apple
// banana
// orange

// 转换为数组
console.log([...fruits.entries()]); // [[0, 'apple'], [1, 'banana'], [2, 'orange']]
console.log([...fruits.keys()]); // [0, 1, 2]
console.log([...fruits.values()]); // ['apple', 'banana', 'orange']
```

## 8. includes()

```javascript
// 检查数组是否包含某个元素
const numbers = [1, 2, 3, 4, 5];

console.log(numbers.includes(3)); // true
console.log(numbers.includes(6)); // false

// 指定起始位置
console.log(numbers.includes(3, 2)); // true
console.log(numbers.includes(1, 2)); // false

// 与 indexOf() 的区别
const arr = [1, 2, NaN, 4];
console.log(arr.indexOf(NaN)); // -1 (无法正确检测 NaN)
console.log(arr.includes(NaN)); // true (可以正确检测 NaN)

// 实际应用：权限检查
function hasPermission(userPermissions, requiredPermission) {
    return userPermissions.includes(requiredPermission);
}

const userPerms = ['read', 'write'];
console.log(hasPermission(userPerms, 'read')); // true
console.log(hasPermission(userPerms, 'delete')); // false
```

## 9. 实际应用场景

### 数组去重
```javascript
// 使用 Set 和扩展运算符去重
function uniqueArray(arr) {
    return [...new Set(arr)];
}

const numbers = [1, 2, 2, 3, 3, 4, 5, 5];
console.log(uniqueArray(numbers)); // [1, 2, 3, 4, 5]

// 对象数组去重
function uniqueObjectArray(arr, key) {
    const seen = new Set();
    return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 1, name: '张三' },
    { id: 3, name: '王五' }
];

console.log(uniqueObjectArray(users, 'id'));
// [{ id: 1, name: '张三' }, { id: 2, name: '李四' }, { id: 3, name: '王五' }]
```

### 数组分块
```javascript
// 将数组分割成指定大小的块
function chunkArray(arr, size) {
    return Array.from(
        { length: Math.ceil(arr.length / size) },
        (_, index) => arr.slice(index * size, (index + 1) * size)
    );
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(chunkArray(data, 3)); 
// [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### 数组扁平化
```javascript
// 使用扩展运算符和 flat() 扁平化数组
const nestedArray = [1, [2, 3], [4, [5, 6]]];

// ES2019 flat() 方法
console.log(nestedArray.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(nestedArray.flat(2)); // [1, 2, 3, 4, 5, 6]

// 自定义扁平化函数
function flattenArray(arr) {
    const result = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });
    return result;
}

console.log(flattenArray(nestedArray)); // [1, 2, 3, 4, 5, 6]
```

### 数组交集、并集、差集
```javascript
// 数组集合操作
class ArraySet {
    // 交集
    static intersection(arr1, arr2) {
        return arr1.filter(item => arr2.includes(item));
    }
    
    // 并集
    static union(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    }
    
    // 差集
    static difference(arr1, arr2) {
        return arr1.filter(item => !arr2.includes(item));
    }
    
    // 对称差集
    static symmetricDifference(arr1, arr2) {
        return [
            ...arr1.filter(item => !arr2.includes(item)),
            ...arr2.filter(item => !arr1.includes(item))
        ];
    }
}

const setA = [1, 2, 3, 4];
const setB = [3, 4, 5, 6];

console.log(ArraySet.intersection(setA, setB)); // [3, 4]
console.log(ArraySet.union(setA, setB)); // [1, 2, 3, 4, 5, 6]
console.log(ArraySet.difference(setA, setB)); // [1, 2]
console.log(ArraySet.symmetricDifference(setA, setB)); // [1, 2, 5, 6]
```

### 数组排序和搜索优化
```javascript
// 使用二分查找优化搜索
function binarySearch(sortedArray, target) {
    let left = 0;
    let right = sortedArray.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArray[mid] === target) {
            return mid;
        } else if (sortedArray[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

const sortedNumbers = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sortedNumbers, 7)); // 3
console.log(binarySearch(sortedNumbers, 6)); // -1
```

### 数组统计和分组
```javascript
// 数组统计和分组工具
class ArrayStats {
    // 计数
    static countBy(arr, iteratee) {
        return arr.reduce((acc, item) => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }
    
    // 分组
    static groupBy(arr, iteratee) {
        return arr.reduce((acc, item) => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }
    
    // 统计信息
    static getStats(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        
        return {
            count: numbers.length,
            sum,
            average: sum / numbers.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            median: sorted.length % 2 === 0 
                ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                : sorted[Math.floor(sorted.length / 2)]
        };
    }
}

const users = [
    { name: '张三', age: 25, department: 'IT' },
    { name: '李四', age: 30, department: 'HR' },
    { name: '王五', age: 28, department: 'IT' },
    { name: '赵六', age: 35, department: 'Finance' }
];

console.log(ArrayStats.countBy(users, 'department'));
// { IT: 2, HR: 1, Finance: 1 }

console.log(ArrayStats.groupBy(users, 'department'));
// { IT: [...], HR: [...], Finance: [...] }

const scores = [85, 92, 78, 96, 88, 73, 91];
console.log(ArrayStats.getStats(scores));
// { count: 7, sum: 603, average: 86.14, min: 73, max: 96, median: 88 }
```

## 总结

ES6 为数组带来的主要扩展包括：

1. **Array.from()**：从类数组对象和可迭代对象创建数组
2. **Array.of()**：创建数组，避免构造函数歧义
3. **扩展运算符**：简化数组操作和转换
4. **find() 和 findIndex()**：查找元素和索引
5. **fill()**：填充数组元素
6. **copyWithin()**：复制数组元素到指定位置
7. **entries(), keys(), values()**：数组迭代器方法
8. **includes()**：检查数组是否包含元素

这些扩展使数组操作更加直观、高效和功能丰富，大大提升了 JavaScript 数组处理能力。