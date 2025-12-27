---
title: var、let、const区别
---

`var`、`let` 和 `const` 是 JavaScript 中用于声明变量的三种关键字，它们之间有重要的区别。让我详细解释它们的差异：

## 1. 作用域（Scope）

### var - 函数作用域
`var` 声明的变量具有函数作用域或全局作用域：

```javascript
function example() {
    if (true) {
        var x = 1;
    }
    console.log(x); // 1 - 可以访问，因为var没有块级作用域
}

// 全局作用域
var globalVar = "我是全局变量";
```

### let/const - 块级作用域
`let` 和 `const` 声明的变量具有块级作用域：

```javascript
function example() {
    if (true) {
        let y = 1;
        const z = 2;
    }
    // console.log(y); // ReferenceError: y is not defined
    // console.log(z); // ReferenceError: z is not defined
}

// 块级作用域示例
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i); // 输出 0, 1, 2
    }, 100);
}

for (var j = 0; j < 3; j++) {
    setTimeout(() => {
        console.log(j); // 输出 3, 3, 3
    }, 100);
}
```

## 2. 变量提升（Hoisting）

### var 的提升行为
`var` 声明会被提升到作用域顶部，但初始化不会：

```javascript
console.log(a); // undefined（不是报错）
var a = 5;

// 上面代码实际执行顺序相当于：
var a; // 声明被提升
console.log(a); // undefined
a = 5; // 赋值保留在原位置
```

### let/const 的暂时性死区
`let` 和 `const` 也会被提升，但在声明前访问会报错：

```javascript
// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

// console.log(c); // ReferenceError: Cannot access 'c' before initialization
const c = 20;
```

## 3. 重复声明

### var 允许重复声明
```javascript
var name = "张三";
var name = "李四"; // 不会报错
console.log(name); // "李四"
```

### let/const 不允许重复声明
```javascript
let age = 25;
// let age = 30; // SyntaxError: Identifier 'age' has already been declared

const PI = 3.14;
// const PI = 3.14159; // SyntaxError: Identifier 'PI' has already been declared
// let PI = 3.15; // SyntaxError: Identifier 'PI' has already been declared
```

## 4. 重新赋值

### var 和 let 可以重新赋值
```javascript
var count = 1;
count = 2; // 正常

let score = 100;
score = 95; // 正常
```

### const 声明后不能重新赋值
```javascript
const MAX_SIZE = 100;
// MAX_SIZE = 200; // TypeError: Assignment to constant variable

// 但是对象和数组的内容可以修改
const user = { name: "张三" };
user.name = "李四"; // 正常
user.age = 25; // 正常

const numbers = [1, 2, 3];
numbers.push(4); // 正常
// numbers = [5, 6, 7]; // TypeError: Assignment to constant variable
```

## 5. 全局对象属性

### var 声明成为全局对象属性
```javascript
var globalVar = "全局变量";
console.log(window.globalVar); // 在浏览器中输出 "全局变量"
```

### let/const 不会成为全局对象属性
```javascript
let globalLet = "let变量";
const globalConst = "const变量";
console.log(window.globalLet); // undefined
console.log(window.globalConst); // undefined
```

## 6. 实际应用示例

```javascript
// 循环中的区别
// 使用 var
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log('var:', i); // 输出三次 "var: 3"
    }, 100);
}

// 使用 let
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log('let:', i); // 输出 "let: 0", "let: 1", "let: 2"
    }, 100);
}

// 常量使用 const
const API_URL = "https://api.example.com";
const CONFIG = {
    timeout: 5000,
    retries: 3
};

// 变量使用 let
let currentUser = null;
let isLoggedIn = false;

function login(username) {
    currentUser = username;
    isLoggedIn = true;
    
    // 临时变量使用 let
    let loginTime = new Date();
    console.log(`${username} 在 ${loginTime} 登录`);
}
```

## 最佳实践建议

1. **优先使用 `const`**：对于不需要重新赋值的变量
2. **必要时使用 `let`**：对于需要重新赋值的变量
3. **避免使用 `var`**：除非需要兼容老版本浏览器
4. **对象和数组使用 `const`**：即使内容会改变，因为引用不会变

```javascript
// 推荐的使用方式
const userName = "张三"; // 常量
const users = []; // 数组引用不变

let userCount = 0; // 需要改变的变量
let isLoading = false;

function addUser(name) {
    users.push(name); // 修改数组内容
    userCount++; // 修改计数
}
```

总结：`var` 是传统的变量声明方式，而 `let` 和 `const` 是 ES6 引入的现代声明方式，具有更安全的作用域规则和更好的错误检测机制。在现代 JavaScript 开发中，推荐优先使用 `const`，必要时使用 `let`，避免使用 `var`。