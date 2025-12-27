---
title: ES6新特性
---

## ES6（ECMAScript 2015）的主要新特性

ES6 是 JavaScript 语言的一个重要更新，引入了许多强大的新特性和语法改进，使 JavaScript 更加强大和现代化。

## 1. 变量声明：let 和 const

```javascript
// let - 块级作用域变量
{
    let x = 1;
    var y = 2;
}
// console.log(x); // ReferenceError
console.log(y); // 2

// const - 常量声明
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// 对象和数组可以修改内容
const user = { name: '张三' };
user.name = '李四'; // 正常
user.age = 25; // 正常
```

## 2. 箭头函数（Arrow Functions）

```javascript
// 基本语法
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello!';

// 多行箭头函数
const processData = (data) => {
    const processed = data.map(item => item * 2);
    return processed.filter(item => item > 10);
};

// 词法 this 绑定
class Counter {
    constructor() {
        this.count = 0;
    }
    
    start() {
        setInterval(() => {
            this.count++; // this 指向 Counter 实例
            console.log(this.count);
        }, 1000);
    }
}
```

## 3. 模板字符串（Template Literals）

```javascript
const name = '张三';
const age = 25;

// 基本用法
const message = `我的名字是${name}，今年${age}岁`;

// 多行字符串
const html = `
<div>
    <h1>${name}</h1>
    <p>年龄：${age}</p>
</div>
`;

// 表达式支持
const result = `计算结果：${2 + 3 * 4}`; // 计算结果：14
```

## 4. 解构赋值（Destructuring）

```javascript
// 数组解构
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // 1 2 [3, 4, 5]

// 对象解构
const user = { name: '张三', age: 25, city: '北京' };
const { name, age, city: location } = user;
console.log(name, age, location); // 张三 25 北京

// 函数参数解构
function introduce({ name, age }) {
    return `我是${name}，今年${age}岁`;
}

console.log(introduce(user));
```

## 5. 类（Classes）

```javascript
// ES6 类语法
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `你好，我是${this.name}`;
    }
    
    // 静态方法
    static getSpecies() {
        return '人类';
    }
}

// 继承
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    study() {
        return `${this.name}正在学习`;
    }
    
    // 重写父类方法
    greet() {
        return `${super.greet()}，我是${this.grade}年级学生`;
    }
}

const student = new Student('小明', 18, 12);
console.log(student.greet());
```

## 6. 模块（Modules）

```javascript
// math.js - 导出
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export default function multiply(a, b) {
    return a * b;
}

// main.js - 导入
import multiply, { PI, add } from './math.js';
import { add as sum } from './math.js';

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5
console.log(multiply(2, 3)); // 6
```

## 7. Promise

```javascript
// 创建 Promise
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve('数据获取成功');
            } else {
                reject('数据获取失败');
            }
        }, 1000);
    });
}

// 使用 Promise
fetchData()
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => console.log('操作完成'));

// Promise 组合
Promise.all([fetchData(), fetchData()])
    .then(results => console.log('所有请求成功:', results))
    .catch(error => console.error('有请求失败:', error));
```

## 8. 生成器（Generators）

```javascript
// 生成器函数
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 4, done: true }

// 异步生成器应用
function* fibonacci() {
    let prev = 0, curr = 1;
    yield prev;
    yield curr;
    while (true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
    console.log(fib.next().value);
}
```

## 9. Set 和 Map 数据结构

```javascript
// Set - 唯一值集合
const set = new Set([1, 2, 3, 4, 4, 5]);
console.log(set); // Set { 1, 2, 3, 4, 5 }

set.add(6);
console.log(set.has(3)); // true
console.log(set.size); // 6

// Map - 键值对集合
const map = new Map();
map.set('name', '张三');
map.set(1, '数字键');
map.set(true, '布尔键');

console.log(map.get('name')); // 张三
console.log(map.size); // 3

// 遍历
for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

## 10. 默认参数和剩余参数

```javascript
// 默认参数
function greet(name = '陌生人', greeting = '你好') {
    return `${greeting}，${name}！`;
}

console.log(greet()); // 你好，陌生人！
console.log(greet('张三')); // 你好，张三！

// 剩余参数
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// 结合使用
function introduce(name, ...hobbies) {
    return `${name} 的爱好：${hobbies.join('、')}`;
}

console.log(introduce('张三', '读书', '游泳', '编程'));
```

## 11. 扩展运算符（Spread Operator）

```javascript
// 数组合并
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 数组复制
const original = [1, 2, 3];
const copy = [...original]; // 浅拷贝

// 对象合并
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// 函数调用
function add(a, b, c) {
    return a + b + c;
}

const numbers = [1, 2, 3];
console.log(add(...numbers)); // 6
```

## 12. 对象扩展

```javascript
const name = '张三';
const age = 25;

// 属性简写
const person = {
    name,  // 等同于 name: name
    age,   // 等同于 age: age
    
    // 方法简写
    greet() {
        return `你好，我是${this.name}`;
    },
    
    // 计算属性名
    [name + 'Info']() {
        return `${this.name}今年${this.age}岁`;
    }
};

// Object.assign
const target = { a: 1 };
const source = { b: 2 };
Object.assign(target, source); // { a: 1, b: 2 }

// Object.is
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(0, -0)); // false
```

## 13. Symbol

```javascript
// 创建 Symbol
const sym1 = Symbol();
const sym2 = Symbol('description');

// Symbol 是唯一的
console.log(Symbol('foo') === Symbol('foo')); // false

// 作为对象属性名
const obj = {
    [sym1]: 'symbol value',
    name: '张三'
};

console.log(obj[sym1]); // "symbol value"

// 内置 Symbol
const iterator = Symbol.iterator;
```

## 14. 迭代器和 for...of

```javascript
// 自定义迭代器
const myIterable = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
};

for (const value of myIterable) {
    console.log(value); // 1, 2, 3
}

// 数组迭代
const fruits = ['apple', 'banana', 'orange'];
for (const fruit of fruits) {
    console.log(fruit);
}

// 字符串迭代
for (const char of 'hello') {
    console.log(char); // h, e, l, l, o
}
```

## 15. Proxy 和 Reflect

```javascript
// Proxy - 创建代理对象
const target = {
    name: '张三',
    age: 25
};

const proxy = new Proxy(target, {
    get(target, property) {
        console.log(`获取属性: ${property}`);
        return target[property];
    },
    
    set(target, property, value) {
        console.log(`设置属性: ${property} = ${value}`);
        target[property] = value;
        return true;
    }
});

proxy.name; // 获取属性: name
proxy.age = 26; // 设置属性: age = 26
```

## 16. 其他重要特性

### 数组新方法
```javascript
const numbers = [1, 2, 3, 4, 5];

// find 和 findIndex
const found = numbers.find(n => n > 3); // 4
const index = numbers.findIndex(n => n === 3); // 2

// includes
console.log(numbers.includes(3)); // true

// Array.from 和 Array.of
const arr1 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
const arr2 = Array.of(1, 2, 3); // [1, 2, 3]
```

### 函数相关
```javascript
// name 属性
function myFunction() {}
console.log(myFunction.name); // "myFunction"

// 尾调用优化（需要引擎支持）
function factorial(n, acc = 1) {
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc); // 尾调用
}
```

## 实际应用示例

```javascript
// 综合应用：用户管理系统
class UserManager {
    constructor() {
        this.users = new Map();
        this.nextId = 1;
    }
    
    // 添加用户
    addUser({ name, email, age }) {
        const id = this.nextId++;
        const user = {
            id,
            name,
            email,
            age,
            createdAt: new Date(),
            [Symbol.toStringTag]: 'User'
        };
        
        this.users.set(id, user);
        return user;
    }
    
    // 查找用户
    findUser(predicate) {
        for (const user of this.users.values()) {
            if (predicate(user)) {
                return user;
            }
        }
        return null;
    }
    
    // 获取所有用户
    * getAllUsers() {
        for (const user of this.users.values()) {
            yield user;
        }
    }
    
    // 批量操作
    batchAdd(users) {
        return users.map(user => this.addUser(user));
    }
}

// 使用示例
const userManager = new UserManager();

// 添加用户
const user1 = userManager.addUser({
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25
});

// 查找用户
const foundUser = userManager.findUser(user => user.age > 20);

// 使用生成器遍历
for (const user of userManager.getAllUsers()) {
    console.log(`${user.name}: ${user.age}岁`);
}

// 批量添加
const newUsers = userManager.batchAdd([
    { name: '李四', email: 'lisi@example.com', age: 30 },
    { name: '王五', email: 'wangwu@example.com', age: 28 }
]);
```

## 总结

ES6 的主要新特性包括：

1. **变量声明**：`let` 和 `const`
2. **函数扩展**：箭头函数、默认参数、剩余参数
3. **字符串扩展**：模板字符串
4. **解构赋值**：数组和对象解构
5. **类**：面向对象编程支持
6. **模块**：标准化的模块系统
7. **异步编程**：Promise、Generator
8. **数据结构**：Set、Map、Symbol
9. **对象扩展**：属性简写、计算属性名
10. **数组扩展**：新方法和扩展运算符
11. **迭代器**：for...of 循环
12. **元编程**：Proxy 和 Reflect

这些特性使 JavaScript 更加强大、灵活和易于使用，是现代 JavaScript 开发的基础。